using aksjehandel.DAL;
using aksjehandel.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
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
        public StockController(IStockRepository db)
        {
            _db = db;
        }
       public async Task<bool> regOrder(Order newOrder)
        {
            return await _db.regOrder(newOrder);
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
            return await _db.getAllOrders();
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
