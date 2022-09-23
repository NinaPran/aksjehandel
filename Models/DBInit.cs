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



                context.Portfolios.Add(portfolio1);
                context.Portfolios.Add(portfolio2);

                context.SaveChanges();

            }

        }
    }
}
