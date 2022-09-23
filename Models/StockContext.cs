using Microsoft.EntityFrameworkCore;

namespace aksjehandel.Models
{
    public class StockContext :DbContext
    {
        public StockContext (DbContextOptions<StockContext> options) : base(options)
        {
            Database.EnsureCreated();
        }

        public DbSet<Portfolio> Portfolio { get; set; }
    }
}
