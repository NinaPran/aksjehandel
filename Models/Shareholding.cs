using System.ComponentModel.DataAnnotations;

namespace aksjehandel.Models
{
    public class Shareholding
    {
        public int Id { get; set; }
        public string Company { get; set; }
        public string Portfolio { get; set; }
        [RegularExpression(@"[0-9]{2,20}")]
        public int Amount { get; set; }
    }
}
