using aksjehandel.Controllers;
using aksjehandel.DAL;
using aksjehandel.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Moq;
using System;
using System.Collections.Generic;
using System.Net;
using System.Threading.Tasks;
using Xunit;
using xUnitTestProject1;

namespace TestProjectAksjehandel
{
    public class ControllerTest
    {
        private const string _signedIn = "signedIn";
        private const string _notSignedIn = "";

        private readonly Mock<IStockRepository> mockRep = new Mock<IStockRepository>();
        private readonly Mock<ILogger<StockController>> mockLog = new Mock<ILogger<StockController>>();

        private readonly Mock<HttpContext> mockHttpContext = new Mock<HttpContext>();
        private readonly MockHttpSession mockSession = new MockHttpSession();

        [Fact]
        public async Task RegOrderTestSignedInAndOK()
        {
            // Arrange
            var newOrder = new Order
            {
                Id = 1,
                PortfolioId = 1,
                CompanyId = 1,
                Type = "sell",
                Price = 10,
                Amount = 5
            };

            var stockController = new StockController(mockRep.Object, mockLog.Object);
            mockRep.Setup(k => k.RegOrder(newOrder)).ReturnsAsync(true);

            mockSession[_signedIn] = _signedIn;
            mockHttpContext.Setup(s => s.Session).Returns(mockSession);
            stockController.ControllerContext.HttpContext = mockHttpContext.Object;

            // Act
            var result = await stockController.regOrder(newOrder) as ObjectResult;

            // Assert
            Assert.Equal((int)HttpStatusCode.OK, result.StatusCode);
            Assert.Equal("Ordre lagret", result.Value);
            Assert.IsType<OkObjectResult>(result);
        }

        [Fact]
        public async Task RegOrderTestSignedInAndRepoFailed()
        {
            // Arrange
            var newOrder = new Order
            {
                Id = 1,
                PortfolioId = 1,
                CompanyId = 1,
                Type = "sell",
                Price = 10,
                Amount = 5
            };

            var stockController = new StockController(mockRep.Object, mockLog.Object);
            mockRep.Setup(k => k.RegOrder(newOrder)).ReturnsAsync(false);

            mockSession[_signedIn] = _signedIn;
            mockHttpContext.Setup(s => s.Session).Returns(mockSession);
            stockController.ControllerContext.HttpContext = mockHttpContext.Object;

            // Act
            var result = await stockController.regOrder(newOrder) as ObjectResult;

            // Assert
            Assert.IsType<BadRequestObjectResult>(result);
        }

        [Fact]
        public async Task RegOrderTestNotSignedIn()
        {
            // Arrange
            var newOrder = new Order
            {
                Id = 1,
                PortfolioId = 1,
                CompanyId = 1,
                Type = "sell",
                Price = 10,
                Amount = 5
            };

            var stockController = new StockController(mockRep.Object, mockLog.Object);
            mockRep.Setup(k => k.RegOrder(newOrder)).ReturnsAsync(true);

            mockSession[_signedIn] = _notSignedIn;
            mockHttpContext.Setup(s => s.Session).Returns(mockSession);
            stockController.ControllerContext.HttpContext = mockHttpContext.Object;

            // Act
            var result = await stockController.regOrder(newOrder) as UnauthorizedObjectResult;

            // Assert
            //Assert.Equal((int)HttpStatusCode.Unauthorized, result.StatusCode);
            Assert.Equal("Ikke logget inn", result.Value);
            // Forventer ikke at regOrder skal kalles hvis inlogging feiler
            mockRep.Verify(mock => mock.RegOrder(newOrder), Times.Never());

        }

        [Fact]
        public async Task RegOrderTestValidationFailed()
        {
            // Arrange
            var newOrder = new Order
            {
                Id = 1,
                PortfolioId = 1,
                CompanyId = 1,
                Type = "WRONG",
                Price = 10,
                Amount = 5
            };

            var stockController = new StockController(mockRep.Object, mockLog.Object);
            mockRep.Setup(k => k.RegOrder(newOrder)).ReturnsAsync(true);

            // Mock feil på Model-validation fra https://stackoverflow.com/a/30800110
            stockController.ModelState.AddModelError("fakeError", "fakeError");

            mockSession[_signedIn] = _signedIn;
            mockHttpContext.Setup(s => s.Session).Returns(mockSession);
            stockController.ControllerContext.HttpContext = mockHttpContext.Object;

            // Act            
            var result = await stockController.regOrder(newOrder) as BadRequestObjectResult;

            // Assert
            Assert.IsType<BadRequestObjectResult>(result);
            Assert.Equal((int)HttpStatusCode.BadRequest, result.StatusCode);
            Assert.Equal("Feil i inputvalidering", result.Value);
            // Forventer ikke at regOrder skal kalles hvis model validation feiler
            mockRep.Verify(mock => mock.RegOrder(newOrder), Times.Never());

        }
        [Fact]
        public async Task DeleteOrderTestSignedInAndOK()
        {
            // Arrange
            mockRep.Setup(k => k.DeleteOrder(It.IsAny<int>())).ReturnsAsync(true);
            var stockController = new StockController(mockRep.Object, mockLog.Object);

            mockSession[_signedIn] = _signedIn;
            mockHttpContext.Setup(s => s.Session).Returns(mockSession);
            stockController.ControllerContext.HttpContext = mockHttpContext.Object;

            // Act
            var result = await stockController.DeleteOrder(It.IsAny<int>()) as OkObjectResult;

            // Assert
            Assert.Equal((int)HttpStatusCode.OK, result.StatusCode);
            Assert.Equal("Ordren slettet", result.Value);

        }
        [Fact]
        public async Task DeleteOrderTestLoggedInAndOrderNotFound()
        {
            // Arrange
            mockRep.Setup(k => k.DeleteOrder(It.IsAny<int>())).ReturnsAsync(false);
            var stockController = new StockController(mockRep.Object, mockLog.Object);

            mockSession[_signedIn] = _signedIn;
            mockHttpContext.Setup(s => s.Session).Returns(mockSession);
            stockController.ControllerContext.HttpContext = mockHttpContext.Object;

            // Act
            var resultat = await stockController.DeleteOrder(It.IsAny<int>()) as NotFoundObjectResult;

            // Assert
            Assert.Equal((int)HttpStatusCode.NotFound, resultat.StatusCode);
            Assert.Equal("Ordren ble ikke slettet", resultat.Value);

        }
        [Fact]
        public async Task DeleteOrderTestNotSignedIn()
        {
            // Arrange
            mockRep.Setup(k => k.DeleteOrder(1)).ReturnsAsync(true);
            var stockController = new StockController(mockRep.Object, mockLog.Object);

            mockSession[_signedIn] = _notSignedIn;
            mockHttpContext.Setup(s => s.Session).Returns(mockSession);
            stockController.ControllerContext.HttpContext = mockHttpContext.Object;

            // Act
            var resultat = await stockController.DeleteOrder(1) as UnauthorizedObjectResult;

            // Assert
            Assert.Equal((int)HttpStatusCode.Unauthorized, resultat.StatusCode);
            Assert.Equal("Ikke logget inn", resultat.Value);
            // Forventer ikke at DeleteOrder() skal kalles hvis innlogging feiler
            mockRep.Verify(mock => mock.DeleteOrder(1), Times.Never());

        }
        [Fact]
        public async Task ChangeOrderTestSignedInAndOK()
        {
            // Arrange
            var changeOrder = new Order
            {
                Id = 1,
                PortfolioId = 1,
                CompanyId = 1,
                Type = "sell",
                Price = 10,
                Amount = 5
            };

            var stockController = new StockController(mockRep.Object, mockLog.Object);
            mockRep.Setup(k => k.ChangeOrder(changeOrder)).ReturnsAsync(true);

            mockSession[_signedIn] = _signedIn;
            mockHttpContext.Setup(s => s.Session).Returns(mockSession);
            stockController.ControllerContext.HttpContext = mockHttpContext.Object;

            // Act
            var result = await stockController.ChangeOrder(changeOrder) as OkObjectResult;

            // Assert
            Assert.Equal((int)HttpStatusCode.OK, result.StatusCode);
            Assert.Equal("Ordren endret", result.Value);
            Assert.IsType<OkObjectResult>(result);

        }

        [Fact]
        public async Task ChangeOrderTestSignedInAndOrderNotFound()
        {
            // Arrange
            var changeOrder = new Order
            {
                Id = 1,
                PortfolioId = 1,
                CompanyId = 1,
                Type = "sell",
                Price = 10,
                Amount = 5
            };
            var stockController = new StockController(mockRep.Object, mockLog.Object);
            mockRep.Setup(k => k.ChangeOrder(changeOrder)).ReturnsAsync(false);

            mockSession[_signedIn] = _signedIn;
            mockHttpContext.Setup(s => s.Session).Returns(mockSession);
            stockController.ControllerContext.HttpContext = mockHttpContext.Object;

            // Act
            var result = await stockController.ChangeOrder(changeOrder) as NotFoundObjectResult;

            // Assert
            Assert.Equal((int)HttpStatusCode.NotFound, result.StatusCode);
            Assert.Equal("Ordren ble ikke endret", result.Value);
        }

        [Fact]
        public async Task ChangeOrderTestNotSignedIn()
        {
            // Arrange
            var changeOrder = new Order
            {
                Id = 1,
                PortfolioId = 1,
                CompanyId = 1,
                Type = "sell",
                Price = 10,
                Amount = 5
            };

            var stockController = new StockController(mockRep.Object, mockLog.Object);
            mockRep.Setup(k => k.ChangeOrder(changeOrder)).ReturnsAsync(true);

            mockSession[_signedIn] = _notSignedIn;
            mockHttpContext.Setup(s => s.Session).Returns(mockSession);
            stockController.ControllerContext.HttpContext = mockHttpContext.Object;

            // Act
            var result = await stockController.ChangeOrder(changeOrder) as UnauthorizedObjectResult;

            // Assert
            Assert.Equal((int)HttpStatusCode.Unauthorized, result.StatusCode);
            Assert.Equal("Ikke logget inn", result.Value);
            // Forventer ikke at ChangeOrder skal kalles hvis innlogging feiler
            mockRep.Verify(mock => mock.ChangeOrder(changeOrder), Times.Never());

        }
        [Fact]
        public async Task ChangeOrderTestValidationFailed()
        {
            // Arrange
            var changeOrder = new Order
            {
                Id = 1,
                PortfolioId = 1,
                CompanyId = 1,
                Type = "WRONG",
                Price = -10,
                Amount = -5
            };

            var stockController = new StockController(mockRep.Object, mockLog.Object);
            mockRep.Setup(k => k.ChangeOrder(changeOrder)).ReturnsAsync(true);
            //stockControllerMock.CallBase = true;

            mockSession[_signedIn] = _signedIn;
            mockHttpContext.Setup(s => s.Session).Returns(mockSession);
            stockController.ControllerContext.HttpContext = mockHttpContext.Object;

            // Mock feil på Model-validation fra https://stackoverflow.com/a/30800110
            stockController.ModelState.AddModelError("fakeError", "fakeError");

            // Act
            var result = await stockController.ChangeOrder(changeOrder) as BadRequestObjectResult;

            // Assert
            Assert.IsType<BadRequestObjectResult>(result);
            Assert.Equal((int)HttpStatusCode.BadRequest, result.StatusCode);
            Assert.Equal("Feil i inputvalidering", result.Value);
            // Forventer ikke at changeOrder skal kalles hvis model validation feiler
            mockRep.Verify(mock => mock.RegOrder(It.IsAny<Order>()), Times.Never());

        }

        [Fact]
        public async Task GetOneOrderTestSignedInAndOK()
        {
            // Arrange
            var oneOrder = new Order
            {
                Id = 1,
                PortfolioId = 1,
                CompanyId = 1,
                Type = "buy",
                Price = 10,
                Amount = 5
            };

            mockRep.Setup(k => k.GetOneOrder(1)).ReturnsAsync(oneOrder);

            var stockController = new StockController(mockRep.Object, mockLog.Object);

            mockSession[_signedIn] = _signedIn;
            mockHttpContext.Setup(s => s.Session).Returns(mockSession);
            stockController.ControllerContext.HttpContext = mockHttpContext.Object;

            // Act
            var result = await stockController.GetOneOrder(1) as OkObjectResult;
            // Assert 
            Assert.Equal((int)HttpStatusCode.OK, result.StatusCode);
            Assert.Equal<Order>(oneOrder, (Order)result.Value);
        }

        [Fact]
        public async Task GetOneOrderTestNotSignedIn()
        {
            // Arrange
            var oneOrder = new Order
            {
                Id = 1,
                PortfolioId = 1,
                CompanyId = 1,
                Type = "buy",
                Price = 10,
                Amount = 5
            };

            mockRep.Setup(k => k.GetOneOrder(1)).ReturnsAsync(oneOrder);

            var stockController = new StockController(mockRep.Object, mockLog.Object);

            mockSession[_signedIn] = _notSignedIn;
            mockHttpContext.Setup(s => s.Session).Returns(mockSession);
            stockController.ControllerContext.HttpContext = mockHttpContext.Object;

            // Act
            var result = await stockController.GetOneOrder(1) as UnauthorizedObjectResult;
            // Assert 
            Assert.Equal((int)HttpStatusCode.Unauthorized, result.StatusCode);
            Assert.Equal("Ikke logget inn", result.Value);
            // Forventer ikke at GetOneOrder skal kalles hvis innlogging feiler
            mockRep.Verify(mock => mock.GetAllOrders(1), Times.Never());
        }

        [Fact]
        public async Task GetOneOrderTestSignedInAndOrderNotFound()
        {
            // Arrange
            var oneOrder = new Order
            {
                Id = 1,
                PortfolioId = 1,
                CompanyId = 1,
                Type = "buy",
                Price = 10,
                Amount = 5
            };

            mockRep.Setup(k => k.GetOneOrder(1)).ReturnsAsync(() => null);

            var stockController = new StockController(mockRep.Object, mockLog.Object);

            mockSession[_signedIn] = _signedIn;
            mockHttpContext.Setup(s => s.Session).Returns(mockSession);
            stockController.ControllerContext.HttpContext = mockHttpContext.Object;

            // Act
            var result = await stockController.GetOneOrder(1) as NotFoundObjectResult;

            // Assert 
            Assert.Equal((int)HttpStatusCode.NotFound, result.StatusCode);
            Assert.Equal("Fant ikke ordren", result.Value);
        }
        [Fact]
        public async Task GetPurchasingPowerTestNotSignedIn()
        {
            // Arrange
            var portfolio1 = new Portfolio
            {
                Id = 1,
                DisplayName = "Axis",
                Cash = 100300,
                PurchasingPower = 100200
            };

            mockRep.Setup(k => k.GetOnePortfolio(1)).ReturnsAsync(portfolio1);

            var stockController = new StockController(mockRep.Object, mockLog.Object);

            mockSession[_signedIn] = _notSignedIn;
            mockHttpContext.Setup(s => s.Session).Returns(mockSession);
            stockController.ControllerContext.HttpContext = mockHttpContext.Object;

            // Act
            var result = await stockController.GetPurchasingPower(1) as UnauthorizedObjectResult;
            // Assert 
            Assert.Equal((int)HttpStatusCode.Unauthorized, result.StatusCode);
            Assert.Equal("Ikke logget inn", result.Value);
            // Forventer ikke at GetOneOrder skal kalles hvis innlogging feiler
            mockRep.Verify(mock => mock.GetOnePortfolio(1), Times.Never());
        }
        [Fact]
        public async Task GetPurchasingPowerTestSignedInAndOK()
        {
            // Arrange
            var portfolio1 = new Portfolio
            {
                Id = 1,
                DisplayName = "Axis",
                Cash = 100300,
                PurchasingPower = 100200
            };

            mockRep.Setup(k => k.GetOnePortfolio(1)).ReturnsAsync(portfolio1);

            var stockController = new StockController(mockRep.Object, mockLog.Object);

            mockSession[_signedIn] = _signedIn;
            mockHttpContext.Setup(s => s.Session).Returns(mockSession);
            stockController.ControllerContext.HttpContext = mockHttpContext.Object;

            // Act
            var result = await stockController.GetPurchasingPower(1) as OkObjectResult;
            // Assert 
            Assert.Equal((int)HttpStatusCode.OK, result.StatusCode);
            Assert.Equal(portfolio1.PurchasingPower, (double)result.Value);
        }
        [Fact]
        public async Task GetPurchasingPowerTestError()
        {
            // Arrange
            var stockController = new StockController(mockRep.Object, mockLog.Object);
            mockRep.Setup(k => k.GetOnePortfolio(It.IsAny<int>())).ReturnsAsync(() => null);

            mockSession[_signedIn] = _signedIn;
            mockHttpContext.Setup(s => s.Session).Returns(mockSession);
            stockController.ControllerContext.HttpContext = mockHttpContext.Object;

            // Act
            var result = await stockController.GetPurchasingPower(It.IsAny<int>()) as StatusCodeResult;

            // Assert
            Assert.IsType<StatusCodeResult>(result);
            Assert.Equal((int)HttpStatusCode.InternalServerError, result.StatusCode);
        }

        [Fact]
        public async Task GetAllOrdersTestSignedInAndOK()
        {
            // Arrange
            var order1 = new Order
            {
                Id = 1,
                PortfolioId = 1,
                CompanyId = 1,
                Type = "sell",
                Price = 10,
                Amount = 5
            };
            var order2 = new Order
            {
                Id = 2,
                PortfolioId = 1,
                CompanyId = 2,
                Type = "buy",
                Price = 7,
                Amount = 1
            };

            var order3 = new Order
            {
                Id = 3,
                PortfolioId = 2,
                CompanyId = 1,
                Type = "buy",
                Price = 4,
                Amount = 9
            };

            var orderList = new List<Order>();
            orderList.Add(order1);
            orderList.Add(order2);
            orderList.Add(order3);

            var stockController = new StockController(mockRep.Object, mockLog.Object);
            mockRep.Setup(k => k.GetAllOrders(It.IsAny<int>())).ReturnsAsync(orderList);

            mockSession[_signedIn] = _signedIn;
            mockHttpContext.Setup(s => s.Session).Returns(mockSession);
            stockController.ControllerContext.HttpContext = mockHttpContext.Object;

            // Act
            var result = await stockController.getAllOrders(It.IsAny<int>()) as OkObjectResult;

            // Assert
            Assert.IsType<OkObjectResult>(result);
            Assert.Equal((int)HttpStatusCode.OK, result.StatusCode);
            Assert.Equal<List<Order>>((List<Order>)result.Value, orderList);
        }


        [Fact]
        public async Task GetAllOrdersTestEmptyList()
        {
            // Arrange

            var orderList = new List<Order>();

            var stockController = new StockController(mockRep.Object, mockLog.Object);
            mockRep.Setup(k => k.GetAllOrders(It.IsAny<int>())).ReturnsAsync(() => new List<Order>());

            mockSession[_signedIn] = _signedIn;
            mockHttpContext.Setup(s => s.Session).Returns(mockSession);
            stockController.ControllerContext.HttpContext = mockHttpContext.Object;

            // Act
            var result = await stockController.getAllOrders(It.IsAny<int>()) as OkObjectResult;

            // Assert
            Assert.IsType<OkObjectResult>(result);
            Assert.Equal((int)HttpStatusCode.OK, result.StatusCode);
            Assert.Equal(orderList, result.Value);

        }
       
        [Fact]
        public async Task GetAllOrdersTestError()
        {
            // Arrange
            var stockController = new StockController(mockRep.Object, mockLog.Object);
            mockRep.Setup(k => k.GetAllOrders(It.IsAny<int>())).ReturnsAsync(() => null);

            mockSession[_signedIn] = _signedIn;
            mockHttpContext.Setup(s => s.Session).Returns(mockSession);
            stockController.ControllerContext.HttpContext = mockHttpContext.Object;

            // Act
            var result = await stockController.getAllOrders(It.IsAny<int>()) as StatusCodeResult;

            // Assert
            Assert.IsType<StatusCodeResult>(result);
            Assert.Equal((int)HttpStatusCode.InternalServerError, result.StatusCode);
        }


        [Fact]
        public async Task GetAllOrdersTestNotSignedIn()
        {
            // Arrange
            var order1 = new Order
            {
                Id = 1,
                PortfolioId = 1,
                CompanyId = 1,
                Type = "sell",
                Price = 10,
                Amount = 5
            };
            var order2 = new Order
            {
                Id = 2,
                PortfolioId = 1,
                CompanyId = 2,
                Type = "buy",
                Price = 7,
                Amount = 1
            };

            var order3 = new Order
            {
                Id = 3,
                PortfolioId = 2,
                CompanyId = 1,
                Type = "buy",
                Price = 4,
                Amount = 9
            };

            var orderList = new List<Order>();
            orderList.Add(order1);
            orderList.Add(order2);
            orderList.Add(order3);

            var stockController = new StockController(mockRep.Object, mockLog.Object);
            mockRep.Setup(k => k.GetAllOrders(It.IsAny<int>())).ReturnsAsync(orderList);

            mockSession[_signedIn] = _notSignedIn;
            mockHttpContext.Setup(s => s.Session).Returns(mockSession);
            stockController.ControllerContext.HttpContext = mockHttpContext.Object;

            // Act
            var result = await stockController.getAllOrders(It.IsAny<int>()) as UnauthorizedObjectResult;

            // Assert
            Assert.Equal((int)HttpStatusCode.Unauthorized, result.StatusCode);
            Assert.Equal("Ikke logget inn", result.Value);
            // Forventer ikke at GetAllOrders skal kalles hvis innlogging feiler
            mockRep.Verify(mock => mock.GetAllOrders(1), Times.Never());

        }

        [Fact]
        public async Task GetAllShareholdingsTestSignedInAndOK()
        {
            // Arrange
            var sharehodling1 = new Shareholding
            {
                Id = 1,
                CompanyId = 1,
                Portfolio = "Axis",
                Amount = 10
            };
            var sharehodling2 = new Shareholding
            {
                Id = 2,
                CompanyId = 1,
                Portfolio = "Allies",
                Amount = 5
            };
            var sharehodling3 = new Shareholding
            {
                Id = 3,
                CompanyId = 2,
                Portfolio = "Axis",
                Amount = 17
            };

            var shareholdingList = new List<Shareholding>();
            shareholdingList.Add(sharehodling1);
            shareholdingList.Add(sharehodling2);
            shareholdingList.Add(sharehodling3);

            var stockController = new StockController(mockRep.Object, mockLog.Object);
            mockRep.Setup(k => k.GetAllShareholdings(It.IsAny<int>())).ReturnsAsync(shareholdingList);
            //stockControllerMock.CallBase = true;

            mockSession[_signedIn] = _signedIn;
            mockHttpContext.Setup(s => s.Session).Returns(mockSession);
            stockController.ControllerContext.HttpContext = mockHttpContext.Object;

            // Act
            var result = await stockController.GetAllShareholdings(It.IsAny<int>()) as OkObjectResult;

            // Assert
            Assert.IsType<OkObjectResult>(result);
            Assert.Equal((int)HttpStatusCode.OK, result.StatusCode);
            Assert.Equal<List<Shareholding>>((List<Shareholding>)result.Value, shareholdingList);

        }

        [Fact]
        public async Task GetAllShareholdingsTestNotSignedIn()
        {
            // Arrange
            var sharehodling1 = new Shareholding
            {
                Id = 1,
                CompanyId = 1,
                Portfolio = "Axis",
                Amount = 10
            };
            var sharehodling2 = new Shareholding
            {
                Id = 2,
                CompanyId = 1,
                Portfolio = "Allies",
                Amount = 5
            };
            var sharehodling3 = new Shareholding
            {
                Id = 3,
                CompanyId = 2,
                Portfolio = "Axis",
                Amount = 17
            };

            var shareholdingList = new List<Shareholding>();
            shareholdingList.Add(sharehodling1);
            shareholdingList.Add(sharehodling2);
            shareholdingList.Add(sharehodling3);

            var stockController = new StockController(mockRep.Object, mockLog.Object);
            mockRep.Setup(k => k.GetAllShareholdings(It.IsAny<int>())).ReturnsAsync(shareholdingList);

            mockSession[_signedIn] = _notSignedIn;
            mockHttpContext.Setup(s => s.Session).Returns(mockSession);
            stockController.ControllerContext.HttpContext = mockHttpContext.Object;
            // Act
            var result = await stockController.GetAllShareholdings(It.IsAny<int>()) as UnauthorizedObjectResult;

            // Assert
            Assert.Equal((int)HttpStatusCode.Unauthorized, result.StatusCode);
            Assert.Equal("Ikke logget inn", result.Value);
            // Forventer ikke at GetAllShareholdings skal kalles hvis innlogging feiler
            mockRep.Verify(mock => mock.GetAllShareholdings(It.IsAny<int>()), Times.Never());

        }

        [Fact]
        public async Task GetAllShareholdingsTestSignedInAndEmptyList()
        {
            // Arrange          
            var shareholdingList = new List<Shareholding>();

            var stockController = new StockController(mockRep.Object, mockLog.Object);
            mockRep.Setup(k => k.GetAllShareholdings(It.IsAny<int>())).ReturnsAsync(() => new List<Shareholding>());

            mockSession[_signedIn] = _signedIn;
            mockHttpContext.Setup(s => s.Session).Returns(mockSession);
            stockController.ControllerContext.HttpContext = mockHttpContext.Object;

            // Act
            var result = await stockController.GetAllShareholdings(It.IsAny<int>()) as OkObjectResult;

            // Assert
            Assert.IsType<OkObjectResult>(result);
            Assert.Equal((int)HttpStatusCode.OK, result.StatusCode);
            Assert.Equal(shareholdingList, result.Value);

        }
        [Fact]
        public async Task GetAllShareholdingsTestSignedInAndError()
        {
            // Arrange          

            var stockController = new StockController(mockRep.Object, mockLog.Object);
            mockRep.Setup(k => k.GetAllShareholdings(It.IsAny<int>())).ReturnsAsync(() => null);

            mockSession[_signedIn] = _signedIn;
            mockHttpContext.Setup(s => s.Session).Returns(mockSession);
            stockController.ControllerContext.HttpContext = mockHttpContext.Object;

            // Act
            var result = await stockController.GetAllShareholdings(It.IsAny<int>()) as StatusCodeResult;

            // Assert
            Assert.IsType<StatusCodeResult>(result);
            Assert.Equal((int)HttpStatusCode.InternalServerError, result.StatusCode);

        }
        [Fact]
        public async Task GetAllPortfoliosTestSignedInAndOK()
        {
            // Arrange
            var portfolio1 = new Portfolio
            {
                Id = 1,
                DisplayName = "Axis",
                Cash = 100300,
                PurchasingPower = 100200
            };
            var portfolio2 = new Portfolio
            {
                Id = 2,
                DisplayName = "Allies",
                Cash = 500700,
                PurchasingPower = 400200
            };
            var portfolio3 = new Portfolio
            {
                Id = 3,
                DisplayName = "Nautrals",
                Cash = 300100,
                PurchasingPower = 200900
            };

            var portfolioList = new List<Portfolio>();
            portfolioList.Add(portfolio1);
            portfolioList.Add(portfolio2);
            portfolioList.Add(portfolio3);

            var stockController = new StockController(mockRep.Object, mockLog.Object);
            mockRep.Setup(k => k.GetAllPortfolios()).ReturnsAsync(portfolioList);
            //stockControllerMock.CallBase = true;

            mockSession[_signedIn] = _signedIn;
            mockHttpContext.Setup(s => s.Session).Returns(mockSession);
            stockController.ControllerContext.HttpContext = mockHttpContext.Object;

            // Act
            var result = await stockController.GetAllPortfolios() as OkObjectResult;

            // Assert
            Assert.IsType<OkObjectResult>(result);
            Assert.Equal((int)HttpStatusCode.OK, result.StatusCode);
            Assert.Equal<List<Portfolio>>((List<Portfolio>)result.Value, portfolioList);

        }

        [Fact]
        public async Task GetAllPortfoliosTestEmptyList()
        {
            // Arrange
            var portfolioList = new List<Portfolio>();

            var stockController = new StockController(mockRep.Object, mockLog.Object);
            mockRep.Setup(k => k.GetAllPortfolios()).ReturnsAsync(() => new List<Portfolio>());

            mockSession[_signedIn] = _signedIn;
            mockHttpContext.Setup(s => s.Session).Returns(mockSession);
            stockController.ControllerContext.HttpContext = mockHttpContext.Object;

            // Act
            var result = await stockController.GetAllPortfolios() as OkObjectResult;

            // Assert
            Assert.IsType<OkObjectResult>(result);
            Assert.Equal((int)HttpStatusCode.OK, result.StatusCode);
            Assert.Equal(portfolioList, result.Value);

        }
        [Fact]
        public async Task GetAllPortfoliosTestErorr()
        {
            // Arrange
            var stockController = new StockController(mockRep.Object, mockLog.Object);
            mockRep.Setup(k => k.GetAllPortfolios()).ReturnsAsync(() => null);

            mockSession[_signedIn] = _signedIn;
            mockHttpContext.Setup(s => s.Session).Returns(mockSession);
            stockController.ControllerContext.HttpContext = mockHttpContext.Object;

            // Act
            var result = await stockController.GetAllPortfolios() as StatusCodeResult;

            // Assert
            Assert.IsType<StatusCodeResult>(result);
            Assert.Equal((int)HttpStatusCode.InternalServerError, result.StatusCode);
        }


        [Fact]
        public async Task GetAllPortfoliosTestNotSignedIn()
        {
            // Arrange
            var portfolio1 = new Portfolio
            {
                Id = 1,
                DisplayName = "Axis",
                Cash = 100300,
                PurchasingPower = 100200
            };
            var portfolio2 = new Portfolio
            {
                Id = 2,
                DisplayName = "Allies",
                Cash = 500700,
                PurchasingPower = 400200
            };
            var portfolio3 = new Portfolio
            {
                Id = 3,
                DisplayName = "Nautrals",
                Cash = 300100,
                PurchasingPower = 200900
            };

            var portfolioList = new List<Portfolio>();
            portfolioList.Add(portfolio1);
            portfolioList.Add(portfolio2);
            portfolioList.Add(portfolio3);


            var stockController = new StockController(mockRep.Object, mockLog.Object);
            mockRep.Setup(k => k.GetAllPortfolios()).ReturnsAsync(portfolioList);
            //stockControllerMock.CallBase = true;

            mockSession[_signedIn] = _notSignedIn;
            mockHttpContext.Setup(s => s.Session).Returns(mockSession);
            stockController.ControllerContext.HttpContext = mockHttpContext.Object;

            // Act
            var result = await stockController.GetAllPortfolios() as UnauthorizedObjectResult;

            // Assert
            Assert.Equal((int)HttpStatusCode.Unauthorized, result.StatusCode);
            Assert.Equal("Ikke logget inn", result.Value);
            // Forventer ikke at GetAllPortfolios skal kalles hvis innlogging feiler
            mockRep.Verify(mock => mock.GetAllPortfolios(), Times.Never());

        }

        [Fact]
        public async Task GetAllCompaniesTestSignedInAndOK()
        {
            // Arrange
            var company1 = new Company
            {
                Id = 1,
                Name = "YARA",
                Symbol = "YAR",
                MaxPrice = 100,
                MinPrice = 10
            };
            var company2 = new Company
            {
                Id = 2,
                Name = "EQUINOR",
                Symbol = "EQNR",
                MaxPrice = 200,
                MinPrice = 20
            };
            var company3 = new Company
            {
                Id = 3,
                Name = "TELENOR",
                Symbol = "TEL",
                MaxPrice = 300,
                MinPrice = 30
            };

            var companyList = new List<Company>();
            companyList.Add(company1);
            companyList.Add(company2);
            companyList.Add(company3);

            var stockController = new StockController(mockRep.Object, mockLog.Object);
            mockRep.Setup(k => k.GetAllCompanies()).ReturnsAsync(companyList);

            mockSession[_signedIn] = _signedIn;
            mockHttpContext.Setup(s => s.Session).Returns(mockSession);
            stockController.ControllerContext.HttpContext = mockHttpContext.Object;
            // Act
            var result = await stockController.GetAllCompanies() as OkObjectResult;

            // Assert
            Assert.IsType<OkObjectResult>(result);
            Assert.Equal((int)HttpStatusCode.OK, result.StatusCode);
            Assert.Equal<List<Company>>((List<Company>)result.Value, companyList);

        }
        [Fact]
        public async Task GetAllCompaniesTestEmptyList()
        {
            // Arrange
            var companyList = new List<Company>();

            var stockController = new StockController(mockRep.Object, mockLog.Object);
            mockRep.Setup(k => k.GetAllCompanies()).ReturnsAsync(() => new List<Company>());

            mockSession[_signedIn] = _signedIn;
            mockHttpContext.Setup(s => s.Session).Returns(mockSession);
            stockController.ControllerContext.HttpContext = mockHttpContext.Object;

            // Act
            var result = await stockController.GetAllCompanies() as OkObjectResult;

            // Assert
            Assert.IsType<OkObjectResult>(result);
            Assert.Equal((int)HttpStatusCode.OK, result.StatusCode);
            Assert.Equal(companyList, result.Value);
        }

        [Fact]
        public async Task GetAllCompaniesTestError()
        {
            // Arrange
            var companyList = new List<Company>();

            var stockController = new StockController(mockRep.Object, mockLog.Object);
            mockRep.Setup(k => k.GetAllCompanies()).ReturnsAsync(() => null);

            mockSession[_signedIn] = _signedIn;
            mockHttpContext.Setup(s => s.Session).Returns(mockSession);
            stockController.ControllerContext.HttpContext = mockHttpContext.Object;

            // Act
            var result = await stockController.GetAllCompanies() as StatusCodeResult;

            // Assert
            Assert.IsType<StatusCodeResult>(result);
            Assert.Equal((int)HttpStatusCode.InternalServerError, result.StatusCode);
        }

        [Fact]
        public async Task GetAllCompaniesTestNotSignedIn()
        {
            // Arrange
            var company1 = new Company
            {
                Id = 1,
                Name = "YARA",
                Symbol = "YAR",
                MaxPrice = 100,
                MinPrice = 10
            };
            var company2 = new Company
            {
                Id = 2,
                Name = "EQUINOR",
                Symbol = "EQNR",
                MaxPrice = 200,
                MinPrice = 20
            };
            var company3 = new Company
            {
                Id = 3,
                Name = "TELENOR",
                Symbol = "TEL",
                MaxPrice = 300,
                MinPrice = 30
            };

            var companyList = new List<Company>();
            companyList.Add(company1);
            companyList.Add(company2);
            companyList.Add(company3);

            var stockController = new StockController(mockRep.Object, mockLog.Object);
            mockRep.Setup(k => k.GetAllCompanies()).ReturnsAsync(companyList);

            mockSession[_signedIn] = _notSignedIn;
            mockHttpContext.Setup(s => s.Session).Returns(mockSession);
            stockController.ControllerContext.HttpContext = mockHttpContext.Object;
            // Act
            var result = await stockController.GetAllCompanies() as UnauthorizedObjectResult;

            // Assert
            Assert.Equal((int)HttpStatusCode.Unauthorized, result.StatusCode);
            Assert.Equal("Ikke logget inn", result.Value);
            // Forventer ikke at GetAllCompanies skal kalles hvis innlogging feiler
            mockRep.Verify(mock => mock.GetAllCompanies(), Times.Never());

        }

        [Fact]
        public async Task GetAllTraidsTestSignedInAndOK()
        {
            // Arrange
            var trade1 = new Trade
            {
                Id = 1,
                Date = "01.01.01",
                Amount = 1,
                Price = 100,
                CompanyId = 1,
                CompanyName = "EQUINOR",
                BuyerPortfolioId = 1,
                SellerPortfolioId = 2
            };
            var trade2 = new Trade
            {
                Id = 2,
                Date = "02.02.02",
                Amount = 2,
                Price = 200,
                CompanyId = 2,
                CompanyName = "YARA",
                BuyerPortfolioId = 2,
                SellerPortfolioId = 1
            };
            var trade3 = new Trade
            {
                Id = 3,
                Date = "03.03.03",
                Amount = 3,
                Price = 300,
                CompanyId = 3,
                CompanyName = "TELENOR",
                BuyerPortfolioId = 2,
                SellerPortfolioId = 3
            };

            var tradeList = new List<Trade>();
            tradeList.Add(trade1);
            tradeList.Add(trade2);
            tradeList.Add(trade3);

            var stockController = new StockController(mockRep.Object, mockLog.Object);
            mockRep.Setup(k => k.GetAllTrades()).ReturnsAsync(tradeList);
            //stockControllerMock.CallBase = true;

            mockSession[_signedIn] = _signedIn;
            mockHttpContext.Setup(s => s.Session).Returns(mockSession);
            stockController.ControllerContext.HttpContext = mockHttpContext.Object;

            // Act
            var result = await stockController.GetAllTrades() as OkObjectResult;

            // Assert
            Assert.IsType<OkObjectResult>(result);
            Assert.Equal((int)HttpStatusCode.OK, result.StatusCode);
            Assert.Equal<List<Trade>>((List<Trade>)result.Value, tradeList);

        }

        [Fact]
        public async Task GetAllTradesTestEmptyList()
        {
            // Arrange
            var tradeList = new List<Trade>();

            var stockController = new StockController(mockRep.Object, mockLog.Object);
            mockRep.Setup(k => k.GetAllTrades()).ReturnsAsync(() => new List<Trade>());

            mockSession[_signedIn] = _signedIn;
            mockHttpContext.Setup(s => s.Session).Returns(mockSession);
            stockController.ControllerContext.HttpContext = mockHttpContext.Object;

            // Act
            var result = await stockController.GetAllTrades() as OkObjectResult;

            // Assert
            Assert.IsType<OkObjectResult>(result);
            Assert.Equal((int)HttpStatusCode.OK, result.StatusCode);
            Assert.Equal(tradeList, result.Value);
        }

        [Fact]
        public async Task GetAllTradesTestError()
        {
            // Arrange
            var stockController = new StockController(mockRep.Object, mockLog.Object);
            mockRep.Setup(k => k.GetAllTrades()).ReturnsAsync(() => null);

            mockSession[_signedIn] = _signedIn;
            mockHttpContext.Setup(s => s.Session).Returns(mockSession);
            stockController.ControllerContext.HttpContext = mockHttpContext.Object;

            // Act
            var result = await stockController.GetAllTrades() as StatusCodeResult;

            // Assert
            Assert.IsType<StatusCodeResult>(result);
            Assert.Equal((int)HttpStatusCode.InternalServerError, result.StatusCode);
        }

        [Fact]
        public async Task GetAllTraidsTestNotSignedIn()
        {
            // Arrange
            var trade1 = new Trade
            {
                Id = 1,
                Date = "01.01.01",
                Amount = 1,
                Price = 100,
                CompanyId = 1,
                CompanyName = "EQUINOR",
                BuyerPortfolioId = 1,
                SellerPortfolioId = 2
            };
            var trade2 = new Trade
            {
                Id = 2,
                Date = "02.02.02",
                Amount = 2,
                Price = 200,
                CompanyId = 2,
                CompanyName = "YARA",
                BuyerPortfolioId = 2,
                SellerPortfolioId = 1
            };
            var trade3 = new Trade
            {
                Id = 3,
                Date = "03.03.03",
                Amount = 3,
                Price = 300,
                CompanyId = 3,
                CompanyName = "TELENOR",
                BuyerPortfolioId = 2,
                SellerPortfolioId = 3
            };

            var tradeList = new List<Trade>();
            tradeList.Add(trade1);
            tradeList.Add(trade2);
            tradeList.Add(trade3);

            var stockController = new StockController(mockRep.Object, mockLog.Object);
            mockRep.Setup(k => k.GetAllTrades()).ReturnsAsync(tradeList);

            mockSession[_signedIn] = _notSignedIn;
            mockHttpContext.Setup(s => s.Session).Returns(mockSession);
            stockController.ControllerContext.HttpContext = mockHttpContext.Object;

            // Act
            var result = await stockController.GetAllTrades() as UnauthorizedObjectResult;

            // Assert
            Assert.Equal((int)HttpStatusCode.Unauthorized, result.StatusCode);
            Assert.Equal("Ikke logget inn", result.Value);
            // Forventer ikke at GetAllTrades skal kalles hvis innlogging feiler
            mockRep.Verify(mock => mock.GetAllTrades(), Times.Never());

        }

        [Fact]
        public async Task SignInTestOK()
        {
            // Arrange
            var user = new User
            {
                Username = "username",
                Password = "password1"
            };
            var stockController = new StockController(mockRep.Object, mockLog.Object);
            mockRep.Setup(k => k.SignIn(user)).ReturnsAsync(true);

            mockSession[_signedIn] = _signedIn;
            mockHttpContext.Setup(s => s.Session).Returns(mockSession);
            stockController.ControllerContext.HttpContext = mockHttpContext.Object;

            // Act
            var result = await stockController.SignIn(user) as OkObjectResult;

            // Assert
            Assert.Equal((int)HttpStatusCode.OK, result.StatusCode);
            Assert.True((bool)result.Value);

        }

        [Fact]
        public async Task SignInTestWrongUserNameOrPassword()
        {
            var user = new User
            {
                Username = "WRONG",
                Password = "WRONG"
            };
            mockRep.Setup(k => k.SignIn(user)).ReturnsAsync(false);

            var stockController = new StockController(mockRep.Object, mockLog.Object);

            mockSession[_signedIn] = _notSignedIn;
            mockHttpContext.Setup(s => s.Session).Returns(mockSession);
            stockController.ControllerContext.HttpContext = mockHttpContext.Object;

            // Act
            var resultat = await stockController.SignIn(user) as OkObjectResult;

            // Assert 
            Assert.Equal((int)HttpStatusCode.OK, resultat.StatusCode);
            Assert.False((bool)resultat.Value);

        }

        [Fact]
        public async Task SignInTestValidationFailed()
        {
            //Arange
            mockRep.Setup(k => k.SignIn(It.IsAny<User>())).ReturnsAsync(false);

            var stockController = new StockController(mockRep.Object, mockLog.Object);

            mockSession[_signedIn] = _signedIn;
            mockHttpContext.Setup(s => s.Session).Returns(mockSession);
            stockController.ControllerContext.HttpContext = mockHttpContext.Object;

            // Mock feil på Model-validation fra https://stackoverflow.com/a/30800110
            stockController.ModelState.AddModelError("fakeError", "fakeError");


            // Act
            var result = await stockController.SignIn(It.IsAny<User>()) as BadRequestObjectResult;

            // Assert
            Assert.IsType<BadRequestObjectResult>(result);
            Assert.Equal("Feil i inputvalidering på server", (result as BadRequestObjectResult).Value);
            Assert.Equal((int)HttpStatusCode.BadRequest, result.StatusCode);
            // Forventer ikke at SignIn skal kalles hvis validering feiler
            mockRep.Verify(mock => mock.SignIn(It.IsAny<User>()), Times.Never());

        }

        [Fact]
        public void SignOutTest()
        {
            var stockController = new StockController(mockRep.Object, mockLog.Object);

            mockHttpContext.Setup(s => s.Session).Returns(mockSession);
            mockSession[_signedIn] = _signedIn;
            stockController.ControllerContext.HttpContext = mockHttpContext.Object;

            // Act
            stockController.SignOut();

            // Assert
            Assert.Equal(_notSignedIn, mockSession[_signedIn]);
        }

        [Fact]
        public void TestValidationSessionTestNotSignedIn()
        {
            // Arrange
            var stockController = new StockController(mockRep.Object, mockLog.Object);

            mockSession[_signedIn] = _notSignedIn;
            mockHttpContext.Setup(s => s.Session).Returns(mockSession);
            stockController.ControllerContext.HttpContext = mockHttpContext.Object;

            // Act
            var result = stockController.TestValidSession() as UnauthorizedObjectResult;
            // Assert 
            Assert.Equal((int)HttpStatusCode.Unauthorized, result.StatusCode);
            Assert.Equal("Ikke logget inn", result.Value);
        }

        [Fact]
        public void TestValidationSessionTestSignedInnAndOK()
        {
            var stockController = new StockController(mockRep.Object, mockLog.Object);

            mockSession[_signedIn] = _signedIn;
            mockHttpContext.Setup(s => s.Session).Returns(mockSession);
            stockController.ControllerContext.HttpContext = mockHttpContext.Object;

            // Act
            var result = stockController.TestValidSession() as OkResult;
            // Assert 
            Assert.Equal((int)HttpStatusCode.OK, result.StatusCode);
        }

    }
}
