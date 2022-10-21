  using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.VisualBasic;
using System.ComponentModel.DataAnnotations.Schema;

namespace aksjehandel.DAL
{
    public class Companies
    {
        public int Id { get; set; }
        public string Symbol { get; set; }
        public string Name { get; set; }
    }

    public class Orders
    {
        public int Id { get; set; }
        public string Type { get; set; }
        public double Price { get; set; }
        public int Amount { get; set; }
        virtual public Companies Company { get; set; }
        virtual public Portfolios Portfolio { get; set; }
    }
    public class Portfolios
    {
        public int Id { get; set; }
        public string DisplayName { get; set; }
        public double Cash { get; set; }
    }
    public class Shareholdings
    {
        public int Id { get; set; }
        public int Amount { get; set; }
        virtual public Companies Company { get; set; }
        virtual public Portfolios Portfolio { get; set; }
    }

    public class Trades
    {
        public int Id { get; set; }
        public string Date { get; set;}
        public int Amount { get; set; }
        public double Price { get; set; }
        virtual public Companies Company { get; set; }
        virtual public Portfolios BuyPortfolio { get; set; }
        virtual public Portfolios SellPortfolio { get; set; }
    }

    public class StockContext : DbContext
    {
        public StockContext(DbContextOptions<StockContext> options) : base(options)
        {
            Database.EnsureCreated();
        }

        public DbSet<Portfolios> Portfolios { get; set; }
        public DbSet<Shareholdings> Shareholdings { get; set; }
        public DbSet<Orders> Orders { get; set; }
        public DbSet<Companies> Companies { get; set; }
        public DbSet<Trades> Trades { get; set; }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder.UseLazyLoadingProxies();
        }
    }

}
