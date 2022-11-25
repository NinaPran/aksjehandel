using System;
using System.ComponentModel.DataAnnotations;
using System.Diagnostics.CodeAnalysis;

namespace aksjehandel.Models
{
    [ExcludeFromCodeCoverage]
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
        [RegularExpression(@"[0-9]{1,10}")]
        public double Price { get; set; }
        [RegularExpression(@"[0-9]{1,9}")]
        public int Amount { get; set; }
    }
}
