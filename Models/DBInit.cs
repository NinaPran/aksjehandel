using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
using System.Reflection;

namespace aksjehandel.Models
{
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

                var portfolio1 = new Portfolios { DisplayName = "Axis", PurchasingPower = 100 };
                var portfolio2 = new Portfolios { DisplayName = "Allies", PurchasingPower = 10.5 };

                var company1 = new Companies { Name = "EQINOR", Symbol = "EQNR" };
                var company2 = new Companies { Name = "YARA", Symbol = "YARIY" };

                var shareholding1 = new Shareholdings { Portfolio = portfolio1, Company = company1, Amount = 40 };
                var shareholding2 = new Shareholdings { Portfolio = portfolio2, Company = company2, Amount = 400 };

                var order1 = new Orders { Company = company1, Amount = 2, Type = "buy", Portfolio = portfolio1, Price= 10 };
                var order2 = new Orders { Company = company2, Amount = 10, Type = "sell", Portfolio = portfolio1, Price = 10 };



                context.Portfolios.Add(portfolio1);
                context.Portfolios.Add(portfolio2);
                context.Companies.Add(company1);
                context.Companies.Add(company2);
                context.Shareholdings.Add(shareholding1);
                context.Shareholdings.Add(shareholding2);
                context.Orders.Add(order1);
                context.Orders.Add(order2);

                context.SaveChanges();

            }

        }
    }
}
