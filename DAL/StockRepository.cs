using aksjehandel.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO.Pipelines;
using System.Linq;
using System.Threading.Tasks;


namespace aksjehandel.DAL
{
    public class StockRepository : IStockRepository
    {

        private readonly StockContext _db;

        public StockRepository(StockContext db)
        {
            _db = db;
        }

        private async Task<bool> executeMatchingOrders(Orders buyOrder, Orders sellOrder, double price, int amount)
        {
            Portfolios buyerPortfolio = buyOrder.Portfolio;
            Portfolios sellerPortfolio = sellOrder.Portfolio;
            Companies company = buyOrder.Company;

            buyOrder.Amount -= amount;
            sellOrder.Amount -= amount;

            await adjustShareholding(buyerPortfolio, company, price, amount);
            await adjustShareholding(sellerPortfolio, company, price, -amount);

            return true;

        }

        private async Task<bool> adjustShareholding(Portfolios portfolio, Companies company, double price, int amount)
        {
            Shareholdings shareholding = await _db.Shareholdings.FirstOrDefaultAsync(s => s.Company.Id == company.Id && s.Portfolio.Id == portfolio.Id);
            double totalPrice = price * amount;
            if (shareholding == null)
            {
                shareholding = new Shareholdings() { Company = company, Portfolio = portfolio, Amount = 0 };
                _db.Shareholdings.Add(shareholding);
            }
            shareholding.Amount += amount;
            portfolio.PurchasingPower += totalPrice;
            if (shareholding.Amount == 0)
            {
                _db.Shareholdings.Remove(shareholding);
            }
            return true;
        }

        private async Task<bool> executeTrade(Orders newOrder, Orders matchingOrder, bool isBuyOrder)
        {
            // Kall denne når to ordre matcher.
            // Denne skal oppdatere shareholdinglist for begge parter
            // Samt justere purchasingpower og evt slette ordre
            // Setter antall ordre motparten tilbyr
            Orders buyOrder = isBuyOrder ? newOrder : matchingOrder;
            Orders sellOrder = !isBuyOrder ? newOrder : matchingOrder;
            Portfolios buyerPortfolio = buyOrder.Portfolio;
            Portfolios sellerPortfolio = sellOrder.Portfolio;
            Companies company = buyOrder.Company;

            int amountCounterparty = matchingOrder.Amount;
            // Finner den laveste verdien av antall aksjer blandt de som er i den innkommende ordren mot motpartens ordre
            int matchingAmount = Math.Min(newOrder.Amount, matchingOrder.Amount);
            // Setter value til verdien av alle aksjene som blir handlet ganget med prisen satt av motpart.
            // Trekker fra den laveste verdien av antall aksjer på både innkommende og motparts antall


            buyOrder.Amount -= matchingAmount;
            sellOrder.Amount -= matchingAmount;

            await adjustShareholding(buyerPortfolio, company, matchingOrder.Price, matchingAmount);
            await adjustShareholding(sellerPortfolio, company, matchingOrder.Price, -matchingAmount);

            if(matchingOrder.Amount == 0)
            {
                // Fjerner matching-order fra DB om den er tom
                _db.Orders.Remove(matchingOrder);
            }

            return true;
        }

        public async Task<bool> regOrder(Order newOrder)
        {
            // Lager en Orders av innkommende newOrder
            Orders newOrders = createOrdersFromOrder(newOrder);

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
                    await executeTrade(newOrders, candidateOrders[i], true);
                }
                else
                {
                    await executeTrade(candidateOrders[i], newOrders, false);
                }
                if (newOrders.Amount == 0)
                {
                    // stopper hvis ordren er tom
                    break;
                }

            }
            // Hvis det er noen aksjer igjen på ordren registreres den i databasen
            if (newOrders.Amount > 0)
            {
                _db.Orders.Add(newOrders);

            }

            // Lagre alle endringer vi har gjort på databasen
            await _db.SaveChangesAsync();

            return true;

        }

        private Orders createOrdersFromOrder(Order newOrder)
        {
            try
            {
                Portfolios chosenPortfolio = _db.Portfolios.Find(newOrder.PortfolioId);
                if (chosenPortfolio == null)
                {
                    Debug.WriteLine("Fant ikke portfolio med id " + newOrder.PortfolioId);
                    throw new ArgumentException("Invalid portfolio ID");
                }
                Companies chosenCompany = _db.Companies.Find(newOrder.CompanyId);
                if (chosenCompany == null)
                {
                    Debug.WriteLine("Fant ikke company med id " + newOrder.CompanyId);
                    throw new ArgumentException("Invalid company ID");
                }
                var newOrderRow = new Orders();
                newOrderRow.Type = newOrder.Type;
                newOrderRow.Price = newOrder.Price;
                newOrderRow.Amount = newOrder.Amount;
                newOrderRow.Portfolio = chosenPortfolio;
                newOrderRow.Company = chosenCompany;
                return newOrderRow;
            }
            catch
            {
                return null;
            }
        }

        private async Task<bool> NewShareholding(int amount, Portfolios portfolio, Companies company)
        {
            try
            {
                var newSharholdingRow = new Shareholdings();
                newSharholdingRow.Amount = amount;
                newSharholdingRow.Portfolio = portfolio;
                newSharholdingRow.Company = company;
                _db.Shareholdings.Add(newSharholdingRow);
                await _db.SaveChangesAsync();
                return true;

            }
            catch
            {
                return false;
            }
        }

        private async Task<bool> DeleteShareholding(int id)
        {
            try
            {
                Shareholdings oneShareholding = await _db.Shareholdings.FindAsync(id);
                _db.Shareholdings.Remove(oneShareholding);
                await _db.SaveChangesAsync();
                return true;
            }
            catch
            {
                return false;
            }
        }

        public async Task<bool> DeleteOrder(int id)
        {
            try
            {
                Orders oneOrder = await _db.Orders.FindAsync(id);
                _db.Orders.Remove(oneOrder);
                await _db.SaveChangesAsync();
                return true;
            }
            catch
            {
                return false;
            }
        }

        public async Task<bool> ChangeOrder(Order changeOrder)
        {
            try
            {
                Orders oneOrder = await _db.Orders.FindAsync(changeOrder.Id);
                oneOrder.Price = changeOrder.Price;
                oneOrder.Amount = changeOrder.Amount;
                await _db.SaveChangesAsync();
                return true;
            }
            catch
            {
                return false;
            }

        }


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
                    PortfolioPurchasingPower = oneOrder.Portfolio.PurchasingPower,
                    Type = oneOrder.Type,
                    Price = oneOrder.Price,
                    Amount = oneOrder.Amount


                };
                return collectedOrder;
            }
            catch
            {
                return null;
            }

        }

        public async Task<List<Order>> getAllOrders()
        {
            try
            {
                List<Order> allOrders = await _db.Orders.Select(o => new Order
                {
                    Id = o.Id,
                    CompanyId = o.Company.Id,
                    CompanyName = o.Company.Name,
                    CompanySymbol = o.Company.Symbol,
                    PortfolioId = o.Portfolio.Id,
                    PortfolioDisplayName = o.Portfolio.DisplayName,
                    PortfolioPurchasingPower = o.Portfolio.PurchasingPower,
                    Type = o.Type,
                    Price = o.Price,
                    Amount = o.Amount
                }).ToListAsync();
                return allOrders;
            }
            catch
            {
                return null;
            }

        }

        public async Task<List<Shareholding>> GetAllShareholdings()
        {
            try
            {
                List<Shareholding> allShareholdings = await _db.Shareholdings.Select(s => new Shareholding
                {
                    Id = s.Id,
                    Amount = s.Amount,
                    Company = s.Company.Name,
                    Portfolio = s.Portfolio.DisplayName
                }).ToListAsync();
                return allShareholdings;
            }
            catch
            {
                return null;
            }

        }

        public async Task<List<Portfolio>> GetAllPortfolios()
        {
            try
            {
                List<Portfolio> allPortfolios = await _db.Portfolios.Select(p => new Portfolio
                {
                    Id = p.Id,
                    DisplayName = p.DisplayName,
                    PurchasingPower = p.PurchasingPower
                }).ToListAsync();
                return allPortfolios;
            }
            catch
            {
                return null;
            }

        }


        public async Task<List<Company>> GetAllCompanies()
        {
            try
            {
                List<Company> allCompanies = await _db.Companies.Select(c => new Company
                {
                    Id = c.Id,
                    Symbol = c.Symbol,
                    Name = c.Name
                }).ToListAsync();
                return allCompanies;
            }
            catch
            {
                return null;
            }

        }
    }
}
