using aksjehandel.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace aksjehandel.DAL
{
    // Oppsett av denne klassen er basert på KundeApp fra ITPE3200-1 22H, OsloMet

    public interface IStockRepository
    {
        Task<bool> RegOrder(Order newOrder);
        Task<bool> DeleteOrder(int id);
        Task<bool> ChangeOrder(Order changeOrder);
        Task<Order> GetOneOrder(int id);
        Task<List<Order>> GetAllOrders(int portfolioId);
        Task<List<Shareholding>> GetAllShareholdings(int portfolioId);
        Task<Portfolio> GetOnePortfolio(int portfolioId);
        Task<List<Portfolio>> GetAllPortfolios();
        Task<List<Company>> GetAllCompanies();
        Task<List<Trade>> GetAllTrades();
        Task<bool> SignIn(User user);
    }
}
