using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
using System.Diagnostics.CodeAnalysis;
using System.Reflection;

namespace aksjehandel.DAL
{
    // Oppsett av denne klassen er basert på KundeApp fra ITPE3200-1 22H, OsloMet

    [ExcludeFromCodeCoverage]
    public static class DBInit
    {
        public static void Initializer(IApplicationBuilder app)
        {
            using (var serviceScope = app.ApplicationServices.CreateScope())
            {
                var context = serviceScope.ServiceProvider.GetService<StockContext>();

                //må slette og opprette databasen hver gang når den skal inisieres (seedes)
                context.Database.EnsureDeleted();
                context.Database.EnsureCreated();

                var portfolio1 = new Portfolios { DisplayName = "Axis", Cash = 12345 };
                var portfolio2 = new Portfolios { DisplayName = "Allies", Cash = 67890.5 };

                var company1 = new Companies { Name = "EQUINOR", Symbol = "EQNR" };
                var company2 = new Companies { Name = "YARA", Symbol = "YAR" };

                var shareholding1 = new Shareholdings { Portfolio = portfolio1, Company = company1, Amount = 40 };
                var shareholding2 = new Shareholdings { Portfolio = portfolio1, Company = company2, Amount = 100 };
                var shareholding3 = new Shareholdings { Portfolio = portfolio2, Company = company2, Amount = 400 };

                var order1 = new Orders { Company = company1, Amount = 2, Type = "buy", Portfolio = portfolio1, Price = 10 };
                var order2 = new Orders { Company = company2, Amount = 10, Type = "sell", Portfolio = portfolio1, Price = 10 };
                var order3 = new Orders { Company = company2, Amount = 10, Type = "sell", Portfolio = portfolio2, Price = 9 };

                var trade1 = new Trades { Company = company1, Amount = 5, Price = 10, Date = new System.DateTime(2022, 10, 21), BuyPortfolio = portfolio1, SellPortfolio = portfolio2 };
                var trade2 = new Trades { Company = company2, Amount = 10, Price = 30, Date = new System.DateTime(2022, 10, 21), BuyPortfolio = portfolio2, SellPortfolio = portfolio1 };

                var user1 = new Users();
                user1.Username = "Admin";
                string password = "Test11";
                byte[] salt = StockRepository.CreateSalt();
                byte[] hash = StockRepository.CreateHash(password, salt);
                user1.Password = hash;
                user1.Salt = salt;

                context.Portfolios.Add(portfolio1);
                context.Portfolios.Add(portfolio2);
                context.Companies.Add(company1);
                context.Companies.Add(company2);
                context.Shareholdings.Add(shareholding1);
                context.Shareholdings.Add(shareholding2);
                context.Shareholdings.Add(shareholding3);
                context.Orders.Add(order1);
                context.Orders.Add(order2);
                context.Orders.Add(order3);
                context.Trades.Add(trade1);
                context.Trades.Add(trade2);
                context.Users.Add(user1);

                context.SaveChanges();

            }

        }
    }
}
