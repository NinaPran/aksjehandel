using System.ComponentModel.DataAnnotations;
using System.Diagnostics.CodeAnalysis;

namespace aksjehandel.Models
{

    [ExcludeFromCodeCoverage]
    public class User
    {
        [RegularExpression(@"^[a-zA-ZøæåØÆÅ. \-]{2,20}$")]
        public string Username { get; set; }
        [RegularExpression(@"^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$")]
        public string Password { get; set; }
    }
}
