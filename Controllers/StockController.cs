using aksjehandel.Models;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;

namespace aksjehandel.Controllers
{
    [Route("[controller]/[action]")]
    public class StockController : ControllerBase
    {
        public List<Portfolio> GetAllPorfolios()
        {
            var portfolios = new List<Portfolio>();

            var portfolio1 = new Portfolio();
            portfolio1.Symbol = "EQNR";
            portfolio1.Name = "EQUINOR";

            var portfolio2 = new Portfolio();
            portfolio2.Symbol = "ORKLA";
            portfolio2.Name = "ORK";

            portfolios.Add(portfolio1);
            portfolios.Add(portfolio2);

            return portfolios;

        }
        


    }
}
