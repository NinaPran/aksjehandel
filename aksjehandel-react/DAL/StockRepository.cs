using aksjehandel.Controllers;
using aksjehandel.Models;
using Microsoft.AspNetCore.Cryptography.KeyDerivation;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO.Pipelines;
using System.Linq;
using System.Reflection;
using System.Security.Cryptography;
using System.Threading.Tasks;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory.Database;


namespace aksjehandel.DAL
{
    // Oppsett av denne klassen er basert på KundeApp fra ITPE3200-1 22H, OsloMet
    public class StockRepository : IStockRepository
    {

        private readonly StockContext _db;
        private ILogger<StockRepository> _log;

        public StockRepository(StockContext db, ILogger<StockRepository> log)
        {
            _db = db;
            _log = log;
        }

        private async Task<bool> AdjustShareholding(Portfolios portfolio, Companies company, double price, int amount)
        {
            // Henter inn shareholding som skal justeres
            Shareholdings shareholding = await _db.Shareholdings.FirstOrDefaultAsync(s => s.Company.Id == company.Id && s.Portfolio.Id == portfolio.Id);

            // Regner ut den totale verdien av aksjene
            double totalPrice = price * amount;
            if (shareholding == null)
            {
                // Oppretter shareholding hvis den ikke eksisterer fra før
                shareholding = new Shareholdings() { Company = company, Portfolio = portfolio, Amount = 0 };
                _db.Shareholdings.Add(shareholding);
            }

            // Justerer antall aksjer på shareholding
            shareholding.Amount += amount;

            // Justerer cash
            portfolio.Cash -= totalPrice;

            if (shareholding.Amount == 0)
            {
                // Fjerner tomme shareholdings
                _db.Shareholdings.Remove(shareholding);
            }
            return true;
        }

        private async Task<bool> ExecuteTrade(Orders newOrder, Orders matchingOrder, bool isBuyOrder)
        {
            // Kall denne når to ordre matcher.
            // Denne skal oppdatere shareholdinglist for begge parter
            // Samt justere purchasingpower og evt slette ordre
            // Setter antall ordre motparten tilbyr

            // Setter hvilken ordre som er kjøp og salg
            Orders buyOrder = isBuyOrder ? newOrder : matchingOrder;
            Orders sellOrder = !isBuyOrder ? newOrder : matchingOrder;

            // Henter inn kjøp og salgs portefølge
            Portfolios buyerPortfolio = buyOrder.Portfolio;
            Portfolios sellerPortfolio = sellOrder.Portfolio;

            // Henter inn selskapet som handles
            Companies company = buyOrder.Company;

            // Finner den laveste verdien av antall aksjer blandt de som er i den innkommende ordren mot motpartens ordre
            int matchingAmount = Math.Min(newOrder.Amount, matchingOrder.Amount);

            // Kaller funskjon som legger til aksjer og trekker purchase power for kjøper       
            await AdjustShareholding(buyerPortfolio, company, matchingOrder.Price, matchingAmount);

            // Kaller funksjon som trekker fra aksjer og øker purchase power for selger
            await AdjustShareholding(sellerPortfolio, company, matchingOrder.Price, -matchingAmount);

            // Justerer antall aksjer som er igjen på ordrene etter trade   
            buyOrder.Amount -= matchingAmount;
            sellOrder.Amount -= matchingAmount;

            // Kaller funksjon som registrerer den nye handlen i Trade
            bool saveTradeOk = SaveTrade(matchingAmount, matchingOrder.Price, company, buyerPortfolio, sellerPortfolio);

            if (matchingOrder.Amount == 0)
            {
                // Fjerner matching-order fra DB om den er tom
                _db.Orders.Remove(matchingOrder);
            }


            return saveTradeOk;
        }

        private bool SaveTrade(int amount, double price, Companies company, Portfolios buyPortfolio, Portfolios sellPortfolio)
        {
            try
            {
                var newTradeRow = new Trades();
                newTradeRow.Date = DateTime.Now;
                newTradeRow.Amount = amount;
                newTradeRow.Price = price;
                newTradeRow.Company = company;
                newTradeRow.BuyPortfolio = buyPortfolio;
                newTradeRow.SellPortfolio = sellPortfolio;

                _db.Trades.Add(newTradeRow);
                return true;
            }
            catch
            {
                return false;
            }
        }

        private async Task<Orders> CheckForAndExecuteTrade(Orders newOrders)
        {
            // Henter inn Shareholding tilhørende ordren som kommer inn
            List<Shareholdings> newOrderShareholdingList = _db.Shareholdings.Where(s => s.Company.Id == newOrders.Company.Id && s.Portfolio.Id == newOrders.Portfolio.Id).ToList();

            // Henter inn Portfolio tilhørende ordren som kommer inn
            Portfolios newOrderPortfolio = newOrders.Portfolio;

            // Anntall som ønskes å kjøpe/selge i den innkommende ordren
            int amountOrder = newOrders.Amount;

            // En liste til å putte ordre som ligger i databasen som matcher innkommende ordre
            List<Orders> candidateOrders = new List<Orders>();

            // Hvis ordren gjelder kjøp av aksjer:
            if (newOrders.Type == "buy")
            {
                // Henter alle salgsordre som ligger i databasen som matcher kjøpers Company og har lavere eller lik pris
                candidateOrders = _db.Orders.Where(o => o.Company.Id == newOrders.Company.Id && o.Type == "sell" && o.Price <= newOrders.Price).ToList();
                // Sorterer de etter pris med den laveste prisen først
                candidateOrders = candidateOrders.OrderBy(a => a.Price).ToList();
            }
            // Hvis ordren gjelder salg av aksjer
            else
            {
                // Henter alle kjøpsordre som ligger i databasen som matcher selgers Companyy og har lik eller høyere pris
                candidateOrders = _db.Orders.Where(o => o.Company.Id == newOrders.Company.Id && o.Type == "buy" && o.Price >= newOrders.Price).ToList();
                // Sorderer så de med høyest pris kommer først
                candidateOrders = candidateOrders.OrderByDescending(a => a.Price).ToList();
            }

            // Løper igjennom listen med aktuelle ordre fra databasen
            for (int i = 0; i < candidateOrders.Count; i++)
            {
                // Utfør ordrene
                if (newOrders.Type == "buy")
                {
                    // Kaller funksjon som utfører trade av to ordre der innkommende er av typen kjøp
                    await ExecuteTrade(newOrders, candidateOrders[i], true);
                }
                else
                {
                    // Kaller funksjon som utfører trade av to ordre der innkommende er av typen salg
                    await ExecuteTrade(candidateOrders[i], newOrders, false);
                }
                if (newOrders.Amount == 0)
                {
                    // stopper hvis ordren er tom
                    break;
                }

            }
            return newOrders;

        }
        public async Task<bool> RegOrder(Order newOrder)
        {
            try
            {

                // Lager en Orders av innkommende newOrder
                Orders newOrders = await CreateOrdersFromOrder(newOrder);
                if (newOrders == null)
                {
                    _log.LogInformation("newOrder var ugyldig");
                    return false;
                }

                // Kaller funksjonen som sjekker om det er mulig å utføre trade og utfører de om mulig
                newOrders = await CheckForAndExecuteTrade(newOrders);

                // Hvis det er noen aksjer igjen på ordren registreres den i databasen
                if (newOrders.Amount > 0)
                {
                    _db.Orders.Add(newOrders);

                }

                // Lagre alle endringer vi har gjort på databasen
                await _db.SaveChangesAsync();

                return true;

            }
            catch (Exception e)
            {
                _log.LogInformation("Feil i RegOrder: " + e.Message);
                return false;
            }

        }

        private async Task<bool> ValidateOrder(bool isBuyOrder, Portfolios portfolio, int companyId, int amount, double price)
        {
            if (isBuyOrder)
            {
                double purchasingPower = CalculatePurchasingPower(portfolio, _db);
                double orderValue = price * amount;
                if (purchasingPower < orderValue)
                {
                    _log.LogInformation("Ordreverdien er større enn kjøpekraft");
                    throw new ArgumentException("Ordreverdien er større enn kjøpekraft");
                }
            }
            else
            {
                Shareholdings shareholding = await GetShareholdingByCompany(portfolio.Id, companyId);
                int remainingAmount = CalculateRemainingAmount(portfolio, shareholding, _db);
                if (remainingAmount < amount)
                {
                    _log.LogInformation("Antallet aksjer i ordren overskrider antall eide");
                    throw new ArgumentException("Antallet aksjer i ordren overskrider antall eide");
                }
            }
            return true;
        }
        private async Task<Orders> CreateOrdersFromOrder(Order newOrder)
        {
            Portfolios chosenPortfolio = _db.Portfolios.Find(newOrder.PortfolioId);
            if (chosenPortfolio == null)
            {
                _log.LogInformation("Fant ikke portfolio med id " + newOrder.PortfolioId);
                throw new ArgumentException("Fant ikke portfolio med id " + newOrder.PortfolioId);
            }
            Companies chosenCompany = _db.Companies.Find(newOrder.CompanyId);
            if (chosenCompany == null)
            {
                _log.LogInformation("Fant ikke company med id " + newOrder.CompanyId);
                throw new ArgumentException("Fant ikke company med id " + newOrder.CompanyId);
            }
            await ValidateOrder(newOrder.Type == "buy", chosenPortfolio, newOrder.CompanyId, newOrder.Amount, newOrder.Price);

            var newOrderRow = new Orders();
            newOrderRow.Type = newOrder.Type;
            newOrderRow.Price = newOrder.Price;
            newOrderRow.Amount = newOrder.Amount;
            newOrderRow.Portfolio = chosenPortfolio;
            newOrderRow.Company = chosenCompany;
            return newOrderRow;
        }

        // Denne metoden er basert på KundeApp fra ITPE3200-1 22H, OsloMet
        public async Task<bool> DeleteOrder(int id)
        {
            try
            {
                Orders oneOrder = await _db.Orders.FindAsync(id);
                _db.Orders.Remove(oneOrder);
                await _db.SaveChangesAsync();
                return true;
            }
            catch (Exception e)
            {
                _log.LogInformation("Feil i DeleteOrder: " + e.Message);
                return false;
            }
        }

        // Denne metoden er basert på KundeApp fra ITPE3200-1 22H, OsloMet
        public async Task<bool> ChangeOrder(Order changeOrder)
        {
            try
            {
                Orders oneOrder = await _db.Orders.FindAsync(changeOrder.Id);

                await ValidateOrder(oneOrder.Type == "buy", oneOrder.Portfolio, oneOrder.Company.Id, oneOrder.Amount, oneOrder.Price);
                // Tar vare på den gamle prisen
                double oldPrice = oneOrder.Price;

                // Endrer ev. pris og antall på ordren
                oneOrder.Price = changeOrder.Price;
                oneOrder.Amount = changeOrder.Amount;

                // Kaller funksjon som sjekker om det er mulighet for å utføre trade og gjennomfører dette om mulige hvis man nå krever lavere pris på salgsordre
                if (oneOrder.Price < oldPrice && oneOrder.Type == "sell")
                {
                    oneOrder = await CheckForAndExecuteTrade(oneOrder);
                }

                // Kaller funksjon som sjekker om det er mulighet for å utføre trade og gjennomfører dette om mulige hvis man nå tilbyr høyere pris på kjøpsordre
                if (oneOrder.Price > oldPrice && oneOrder.Type == "buy")
                {
                    oneOrder = await CheckForAndExecuteTrade(oneOrder);
                }

                // Sletter ordren om den er tom
                if (oneOrder.Amount == 0)
                {
                    await DeleteOrder(oneOrder.Id);
                }

                await _db.SaveChangesAsync();
                return true;
            }
            catch (Exception e)
            {
                _log.LogInformation("Feil i change Order: ", e.Message);
                return false;
            }

        }

        // Denne metoden er basert på KundeApp fra ITPE3200-1 22H, OsloMet
        public async Task<Order> GetOneOrder(int id)
        {
            try
            {
                Orders oneOrder = await _db.Orders.FindAsync(id);
                var collectedOrder = new Order()
                {
                    Id = oneOrder.Id,
                    CompanyId = oneOrder.Company.Id,
                    CompanyName = oneOrder.Company.Name,
                    CompanySymbol = oneOrder.Company.Symbol,
                    PortfolioId = oneOrder.Portfolio.Id,
                    PortfolioDisplayName = oneOrder.Portfolio.DisplayName,
                    PortfolioCash = oneOrder.Portfolio.Cash,
                    Type = oneOrder.Type,
                    Price = oneOrder.Price,
                    Amount = oneOrder.Amount


                };
                return collectedOrder;
            }
            catch (Exception e)
            {
                _log.LogInformation("Feil i GetOneOrder: " + e.Message);
                return null;
            }

        }

        // Denne metoden er basert på KundeApp fra ITPE3200-1 22H, OsloMet
        public async Task<List<Order>> GetAllOrders(int portfolioId)
        {
            try
            {
                List<Order> allOrders = await _db.Orders.Where(o => o.Portfolio.Id == portfolioId).Select(o => new Order
                {
                    Id = o.Id,
                    CompanyId = o.Company.Id,
                    CompanyName = o.Company.Name,
                    CompanySymbol = o.Company.Symbol,
                    PortfolioId = o.Portfolio.Id,
                    PortfolioDisplayName = o.Portfolio.DisplayName,
                    PortfolioCash = o.Portfolio.Cash,
                    Type = o.Type,
                    Price = o.Price,
                    Amount = o.Amount
                }).ToListAsync();

                return allOrders;
            }
            catch (Exception e)
            {
                _log.LogInformation("Feil i GetAllOrders: " + e.Message);
                return null;
            }

        }

        // Denne metoden er basert på KundeApp fra ITPE3200-1 22H, OsloMet
        public async Task<List<Shareholding>> GetAllShareholdings(int portfolioId)
        {
            try
            {
                List<Shareholding> allShareholdings = await _db.Shareholdings.Where(s => s.Portfolio.Id == portfolioId).Select(s => new Shareholding
                {
                    Id = s.Id,
                    Amount = s.Amount,
                    CompanyName = s.Company.Name,
                    CompanyId = s.Company.Id,
                    CompanySymbol = s.Company.Symbol,
                    Portfolio = s.Portfolio.DisplayName,
                    RemainingAmount = StockRepository.CalculateRemainingAmount(s.Portfolio, s, _db)
                }).ToListAsync();
                return allShareholdings;
            }
            catch (Exception e)
            {
                _log.LogInformation("Feil i GetAllShareholdings: " + e.Message);
                return null;
            }

        }

        // Denne metoden er basert på KundeApp fra ITPE3200-1 22H, OsloMet
        public async Task<Shareholdings> GetShareholdingByCompany(int portfolioId, int companyId)
        {
            try
            {
                return await _db.Shareholdings.FirstAsync(s => s.Company.Id == companyId && s.Portfolio.Id == portfolioId);

            }
            catch
            {
                _log.LogInformation("Fant ingen shareholding for portfolioId: " + portfolioId + " og companyId: " + companyId);

                throw new ArgumentException("Fant ingen shareholding for portfolioId: " + portfolioId + " og companyId: " + companyId);
            }

        }

        // Denne metoden er basert på KundeApp fra ITPE3200-1 22H, OsloMet
        public async Task<List<Portfolio>> GetAllPortfolios()
        {
            try
            {
                List<Portfolio> allPortfolios = await _db.Portfolios.Select(p => new Portfolio
                {
                    Id = p.Id,
                    DisplayName = p.DisplayName,
                    Cash = p.Cash,
                    PurchasingPower = StockRepository.CalculatePurchasingPower(p, _db)
                }).ToListAsync();
                return allPortfolios;
            }
            catch (Exception e)
            {
                _log.LogInformation("Feil i GetAllPortfolios: " + e.Message);
                return null;
            }

        }

        // Denne metoden er basert på KundeApp fra ITPE3200-1 22H, OsloMet
        public async Task<List<Trade>> GetAllTrades()
        {
            try
            {
                List<Trade> allTrades = await _db.Trades.Select(t => new Trade
                {
                    Id = t.Id,
                    Date = t.Date.ToShortDateString(),
                    Amount = t.Amount,
                    Price = t.Price,
                    CompanyId = t.Company.Id,
                    CompanyName = t.Company.Name,
                    BuyerPortfolioId = t.BuyPortfolio.Id,
                    SellerPortfolioId = t.SellPortfolio.Id
                }).ToListAsync();
                return allTrades;
            }
            catch (Exception e)
            {
                _log.LogInformation("Feil i GetAllTrades: " + e.Message);
                return null;
            }
        }

        // Denne metoden er basert på KundeApp fra ITPE3200-1 22H, OsloMet
        public async Task<List<Company>> GetAllCompanies()
        {
            try
            {
                List<Company> allCompanies = await _db.Companies.Select(c => new Company
                {
                    Id = c.Id,
                    Symbol = c.Symbol,
                    Name = c.Name,
                    MaxPrice = StockRepository.getMaxTradePrice(c, _db),
                    MinPrice = StockRepository.getMinTradePrice(c, _db),
                }).ToListAsync();
                return allCompanies;
            }
            catch (Exception e)
            {
                _log.LogInformation("Feil i GetAllCompanies: " + e.Message);
                return null;
            }

        }

        // De 4 metodene under måtte være static for ikke å ha fare for memory leaks, og de kunne ikke være async
        private static double CalculatePurchasingPower(Portfolios portfolio, StockContext db)
        {
            // returnerer cash minus summen av alle kjøpsordre tilhørende portfølgen sine aksjer * prisen
            return portfolio.Cash - db.Orders.Where(o => o.Portfolio.Id == portfolio.Id && o.Type == "buy").Sum(o => o.Amount * o.Price);

            //Finne ut om disponibelt beløp er i orden etter alle ordrene er satt i bestilling
        }

        private static int CalculateRemainingAmount(Portfolios portfolio, Shareholdings shareholding, StockContext db)
        {

            return shareholding.Amount - db.Orders.Where(o => o.Portfolio.Id == portfolio.Id && o.Company.Id == shareholding.Company.Id && o.Type == "sell").Sum(o => o.Amount);
        }

        private static double getMaxTradePrice(Companies company, StockContext db)
        {
            return db.Trades.Max(t => t.Price);
        }

        private static double getMinTradePrice(Companies company, StockContext db)
        {
            return db.Trades.Min(t => t.Price);
        }

        public static byte[] CreateHash(string password, byte[] salt)
        {
            return KeyDerivation.Pbkdf2(
                password: password,
                salt: salt,
                prf: KeyDerivationPrf.HMACSHA512,
                iterationCount: 1000,
                numBytesRequested: 32);
        }

        public static byte[] CreateSalt()
        {
            var csp = new RNGCryptoServiceProvider();
            var salt = new byte[24];
            csp.GetBytes(salt);
            return salt;
        }

        public async Task<bool> SignIn(User user)
        {
            try
            {
                Users foundUser = await _db.Users.FirstOrDefaultAsync(u => u.Username == user.Username);
                if (foundUser == null)
                {
                    return false;
                }
                // Check password
                byte[] hash = CreateHash(user.Password, foundUser.Salt);
                bool ok = hash.SequenceEqual(foundUser.Password);
                if (ok)
                {
                    return true;
                }
                return false;
            }
            catch (Exception e)
            {
                _log.LogInformation(e.Message);
                return false;
            }
        }

    }
}
