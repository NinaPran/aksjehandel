using aksjehandel.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace aksjehandel.DAL
{
    public interface IStockRepository
    {
        Task<bool> RegOrder(Order newOrder);
        Task<bool> DeleteOrder(int id);
        Task<bool> ChangeOrder(Order changeOrder);
        Task<Order> GetOneOrder(int id);
        Task<List<Order>> GetAllOrders(int portofolioId);
        Task<List<Shareholding>> GetAllShareholdings(int portofolioId);
        Task<List<Portfolio>> GetAllPortfolios();
        Task<List<Company>> GetAllCompanies();
    }
}
