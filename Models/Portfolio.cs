using System.ComponentModel.DataAnnotations;

namespace aksjehandel.Models
{
    public class Portfolio
    {
        public int Id { get; set; }
        [RegularExpression(@"[0-9a-zA-ZæøåÆØÅ. \-]{2,20}")]
        public string DisplayName { get; set; }
        [RegularExpression(@"[0-9]{2,10}")]
        public double Cash { get; set; }
        public double PurchasingPower { get; set; }

    }
}
