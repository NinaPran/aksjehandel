namespace aksjehandel.Models
{
    public class Order
    {
        public int Id { get; set; }
        public string Company { get; set; }
        public string Portfolio { get; set; }
        public string Type { get; set; }
        public double Price { get; set; }
        public int Amount { get; set; }
    }
}
