using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.VisualBasic;
using System;
using System.ComponentModel.DataAnnotations.Schema;
using System.Diagnostics.CodeAnalysis;

namespace aksjehandel.DAL
{
    // Oppsett av disse klassene er basert på KundeApp fra ITPE3200-1 22H, OsloMet

    [ExcludeFromCodeCoverage]
    public class Companies
    {
        public int Id { get; set; }
        public string Symbol { get; set; }
        public string Name { get; set; }
    }

    [ExcludeFromCodeCoverage]
    public class Orders
    {
        public int Id { get; set; }
        public string Type { get; set; }
        public double Price { get; set; }
        public int Amount { get; set; }
        virtual public Companies Company { get; set; }
        virtual public Portfolios Portfolio { get; set; }
    }

    [ExcludeFromCodeCoverage]
    public class Portfolios
    {
        public int Id { get; set; }
        public string DisplayName { get; set; }
        public double Cash { get; set; }
    }

    [ExcludeFromCodeCoverage]
    public class Shareholdings
    {
        public int Id { get; set; }
        public int Amount { get; set; }
        virtual public Companies Company { get; set; }
        virtual public Portfolios Portfolio { get; set; }
    }

    [ExcludeFromCodeCoverage]

    public class Trades
    {
        public int Id { get; set; }
        public DateTime Date { get; set; }
        public int Amount { get; set; }
        public double Price { get; set; }
        virtual public Companies Company { get; set; }
        virtual public Portfolios BuyPortfolio { get; set; }
        virtual public Portfolios SellPortfolio { get; set; }
    }

    [ExcludeFromCodeCoverage]
    public class Users
    {
        public int Id { get; set; }
        public string Username { get; set; }
        public byte[] Password { get; set; }
        public byte[] Salt { get; set; }
    }

    [ExcludeFromCodeCoverage]
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
        public DbSet<Users> Users { get; set; }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder.UseLazyLoadingProxies();
        }
    }

}
