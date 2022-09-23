using aksjehandel.Models;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Linq;

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

        public List<Portfolio> GetAllPortfolios()
        {
            try
            {
                List<Portfolio> portfolios = _db.Portfolio.ToList();
                return portfolios;
            }
            catch
            {
                return null;
            }         

        }      


    }
}
