using aksjehandel.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
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
