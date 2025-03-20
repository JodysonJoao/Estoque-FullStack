namespace Estoque.Backend.Models
{
    public class Order
    {
        public int Id { get; set; }
        public string Client { get; set; }
        public string Status { get; set; } = "Pendente";
        public decimal Total { get; set; }
        public string Date { get; set; } = DateTime.UtcNow.ToString("dd-MM-yyyy");
        public List<OrderItem> Products { get; set; } = new();
    }

    public class OrderItem
    {
        public int Id { get; set; }
        public int ProductId { get; set; }
        public string ProductName { get; set; }
        public decimal Price { get; set; }
        public string Image { get; set; }
    }
}
