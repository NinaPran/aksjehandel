﻿using System.ComponentModel.DataAnnotations;

namespace aksjehandel.Models
{
    public class Shareholding
    {
        public int Id { get; set; }
        public string CompanyName { get; set; }

        public int CompanyId { get; set; }
        public string CompanySymbol { get; set;}
        public string Portfolio { get; set; }
        [RegularExpression(@"[0-9]{1,9}")]
        public int Amount { get; set; }

        public int RemainingAmount { get; set; }
    }
}
