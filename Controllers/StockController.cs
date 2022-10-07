using aksjehandel.DAL;
using aksjehandel.Models;
using Castle.Core.Logging;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;

namespace aksjehandel.Controllers
{
    [Route("[controller]/[action]")]
    public class StockController : ControllerBase
    {
        private readonly IStockRepository _db;

        private ILogger<StockController> _log;
        public StockController(IStockRepository db, ILogger<StockController> log)
        {
            _db = db;
            _log = log;
        }
       public async Task<bool> regOrder(Order newOrder)
        {
            return await _db.RegOrder(newOrder);
        }
        public async Task<bool> DeleteOrder(int id)
        {
            return await _db.DeleteOrder(id);
        }
        public async Task<bool> ChangeOrder(Order changeOrder)
        {
            return await _db.ChangeOrder(changeOrder);
        }
        public async Task<Order> GetOneOrder(int id)
        {
            return await _db.GetOneOrder(id);
        }
        public async Task<List<Order>> getAllOrders()
        {
            _log.LogInformation("Test Log");
            return await _db.GetAllOrders();

        }
        public async Task<List<Shareholding>> GetAllShareholdings()
        {
            return await _db.GetAllShareholdings();
        }
        public async Task<List<Portfolio>> GetAllPortfolios()
        {
            return await _db.GetAllPortfolios();
        }
        public async Task<List<Company>> GetAllCompanies()
        {
            return await _db.GetAllCompanies();
            
        }
    }
}
