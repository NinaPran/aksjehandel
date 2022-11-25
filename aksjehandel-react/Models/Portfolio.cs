using System.ComponentModel.DataAnnotations;
using System.Diagnostics.CodeAnalysis;

namespace aksjehandel.Models
{
    [ExcludeFromCodeCoverage]
    public class Portfolio
    {
        public int Id { get; set; }
        [RegularExpression(@"[0-9a-zA-ZæøåÆØÅ. \-]{2,20}")]
        public string DisplayName { get; set; }
        [RegularExpression(@"[0-9]{1,10}")]
        public double Cash { get; set; }
        public double PurchasingPower { get; set; }

    }
}
