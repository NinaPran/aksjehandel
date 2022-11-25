using System.ComponentModel.DataAnnotations;
using System.Diagnostics.CodeAnalysis;

namespace aksjehandel.Models
{
    public class User
    {
        [ExcludeFromCodeCoverage]
        [RegularExpression(@"^[a-zA-ZøæåØÆÅ. \-]{2,20}$")]
        public string Username { get; set; }
        [RegularExpression(@"^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$")]
        public string Password { get; set; }
    }
}
