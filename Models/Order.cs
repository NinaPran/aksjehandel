namespace aksjehandel.Models
{
    public class Order
    {
        public int Id { get; set; }
        public int CompanyId { get; set; }
        public string CompanyName { get; set; }
        public string CompanySymbol { get; set; }
        public int PortfolioId { get; set; }
        public string PortfolioDisplayName { get; set; }
        public double PortfolioPurchasingPower { get; set; }
        public string Type { get; set; }
        public double Price { get; set; }
        public int Amount { get; set; }
    }
}
