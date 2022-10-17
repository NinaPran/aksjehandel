using System.ComponentModel.DataAnnotations;

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
        public double PortfolioCash { get; set; }
        [RegularExpression(@"^(buy|sell)$")]
        public string Type { get; set; }
        [RegularExpression(@"[0-9]{2,8}")]
        public double Price { get; set; }
        [RegularExpression(@"[0-9]{1,8}")]
        public int Amount { get; set; }
    }
}
