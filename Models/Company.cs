using System.ComponentModel.DataAnnotations;

namespace aksjehandel.Models
{
    public class Company
    {
        public int Id { get; set; }
        [RegularExpression(@"[a-zæøåA-ZÆØÅ]{2,4}")]
        public string Symbol { get; set; }
        [RegularExpression(@"[A-ZÆØÅ]{2,20}")]
        public string Name { get; set; }
        public double MaxPrice { get; set; }
        public double MinPrice { get; set; }
    }
}
