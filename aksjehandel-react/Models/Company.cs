using System.ComponentModel.DataAnnotations;
using System.Diagnostics.CodeAnalysis;

namespace aksjehandel.Models
{
    [ExcludeFromCodeCoverage]
    public class Company
    {
        public int Id { get; set; }
        [RegularExpression(@"[A-ZÆØÅ]{3,5}")]
        public string Symbol { get; set; }
        [RegularExpression(@"[0-9a-zæøåA-ZÆØÅ. \-]{2,30}")]
        public string Name { get; set; }
        public double MaxPrice { get; set; }
        public double MinPrice { get; set; }
    }
}
