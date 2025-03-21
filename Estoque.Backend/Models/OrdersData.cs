namespace Estoque.Backend.Models
{
    public class OrdersData
    {
        public decimal TotalRevenue { get; set; }

        public int SalesMonth { get; set; }

        public int SalesYear { get; set; }

        public int TotalClients { get; set; }

        public List<SalesCategory> SalesCategory { get; set; }

        public List<LastOrders> LastOrders { get; set; }
    }

    public class SalesCategory
    {
        public string Category {  get; set; }

        public int Sales { get; set; }
    }

    public class LastOrders
    {
        public int Id { get; set; }
        public string Client { get; set; }
        public string Status { get; set; } = "Pendente";
        public decimal Total { get; set; }
        public string Date { get; set; } = DateTime.UtcNow.ToString("dd-MM-yyyy");
        public List<OrderItem> Products { get; set; } = new();
    }
}
