using aksjehandel.Models;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Diagnostics;
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

        public async Task<bool> regOrder(Order newOrder)
        {
            try
            {
                Portfolios chosenPortfolio = _db.Portfolios.Find(newOrder.PortfolioId);
                if (chosenPortfolio == null)
                {
                    Debug.WriteLine("Fant ikke portfolio med id " + newOrder.PortfolioId);
                    return false;
                }
                Companies chosenCompany = _db.Companies.Find(newOrder.CompanyId);
                if (chosenCompany == null)
                {
                    Debug.WriteLine("Fant ikke company med id " + newOrder.CompanyId);
                    return false;
                }
                var newOrderRow = new Orders();
                newOrderRow.Type = newOrder.Type;
                newOrderRow.Price = newOrder.Price;
                newOrderRow.Amount = newOrder.Amount;
                newOrderRow.Portfolio = chosenPortfolio;
                newOrderRow.Company = chosenCompany;

                _db.Orders.Add(newOrderRow);
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

        // Må endre getAllOrders så den kun henter til gjeldende portfolio
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
        // Må endre getAllShareholdings så den kun henter til gjeldende portfolio
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
