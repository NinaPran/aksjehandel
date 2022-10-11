﻿using System.ComponentModel.DataAnnotations;

namespace aksjehandel.Models
{
    public class Company
    {
        public int Id { get; set; }
        [RegularExpression(@"[A-ZÆØÅ]{2,4}")]
        public string Symbol { get; set; }
        [RegularExpression(@"[A-ZÆØÅ]{2,20}")]
        public string Name { get; set; }
    }
}
