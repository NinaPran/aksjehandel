using aksjehandel.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace aksjehandel.Controllers
{
    [Route("[controller]/[action]")]
    public class StockController : ControllerBase
    {
        private readonly StockContext _db;

        public StockController(StockContext db)
        {
            _db = db;
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
                    Company = oneOrder.Company.Name,
                    Portfolio = oneOrder.Portfolio.DisplayName,
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
                List<Order> allShareholdings = await _db.Orders.Select(o => new Order
                {
                    Id = o.Id,
                    Company = o.Company.Name,
                    Portfolio = o.Portfolio.DisplayName,
                    Type = o.Type,
                    Price = o.Price,
                    Amount = o.Amount
                }).ToListAsync();
                return allShareholdings;
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


    }
}
