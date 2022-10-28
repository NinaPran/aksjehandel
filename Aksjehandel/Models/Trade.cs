namespace aksjehandel.Models
{
    public class Trade
    {
        public int Id { get; set; }
        public string Date { get; set; }
        public int Amount { get; set; }
        public double Price { get; set; }
        public int CompanyId { get; set; }
        public string CompanyName { get; set; }
        public int BuyerPortfolioId { get; set; }
        public int SellerPortfolioId { get; set; }
    }
}
