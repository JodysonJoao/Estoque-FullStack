using Estoque.Backend.Data;
using Estoque.Backend.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Threading.Tasks;

namespace Estoque.Backend.Services
{
    public class OrderService : IOrderService
    {
        private readonly AppDbContext _context;

        private readonly CultureInfo _culture = CultureInfo.InvariantCulture;

        public OrderService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<Order> CreateOrder(Order order)
        {
            foreach (var item in order.Products)
            {
                var product = await _context.Products.FindAsync(item.ProductId);
                if (product == null || product.stock < 1)
                {
                    throw new Exception($"Produto {item.ProductName} não disponível em estoque.");
                }
                product.stock -= 1;
                _context.Products.Update(product);
            }
            _context.Orders.Add(order);
            await _context.SaveChangesAsync();
            return order;
        }

        public void DeleteOrder(int id)
        {
            using var transaction = _context.Database.BeginTransaction();
            try
            {
                var order = _context.Orders.Include(o => o.Products).FirstOrDefault(o => o.Id == id);
                if (order == null)
                    throw new Exception("Pedido não encontrado.");

                bool isCompleted = order.Status.Equals("Concluído", StringComparison.OrdinalIgnoreCase);
                if (!isCompleted)
                {
                    foreach (var item in order.Products)
                    {
                        var product = _context.Products.Find(item.ProductId);
                        if (product != null)
                        {
                            product.stock += 1;
                            _context.Products.Update(product);
                        }
                    }
                }
                _context.Orders.Remove(order);
                _context.SaveChanges();
                transaction.Commit();
            }
            catch
            {
                transaction.Rollback();
                throw;
            }
        }
        public void UpdateStatus(int id, string status)
        {
            if (string.IsNullOrWhiteSpace(status))
                throw new ArgumentException("Status inválido.");

            var order = _context.Orders.FirstOrDefault(o => o.Id == id);
            if (order == null)
                throw new InvalidOperationException("Pedido não encontrado.");

            var validStatuses = new List<string> { "Pendente", "Em Andamento", "Concluído", "Cancelado" };
            if (!validStatuses.Contains(status))
                throw new ArgumentException("Status inválido.");

            order.Status = status;
            _context.Orders.Update(order);
            _context.SaveChanges();
        }

        public List<Order> Get()
        {
            return _context.Orders.Include(o => o.Products).ToList();
        }

        // Retorna um pedido por ID
        public Order GetById(int id)
        {
            return _context.Orders.Include(o => o.Products).FirstOrDefault(o => o.Id == id);
        }

        public OrdersData GetOrdersData()
        {
            var currentMonth = DateTime.UtcNow.Month;
            var currentYear = DateTime.UtcNow.Year;

            var orders = _context.Orders.Where(o => o.Status == "Concluído").ToList();

            var totalRevenue = orders.Sum(o => o.Total);
            int salesMonth = orders.Count(o =>
            {
                if (DateTime.TryParseExact(o.Date, "dd-MM-yyyy", _culture, DateTimeStyles.None, out DateTime date))
                {
                    return date.Month == currentMonth;
                }
                return false;
            });
            int salesYear = orders.Count(o =>
            {
                if (DateTime.TryParseExact(o.Date, "dd-MM-yyyy", _culture, DateTimeStyles.None, out DateTime date))
                {
                    return date.Year == currentYear;
                }
                return false;
            });
            int totalClients = orders.Select(o => o.Client).Distinct().Count();

            return new OrdersData
            {
                TotalRevenue = totalRevenue,
                SalesMonth = salesMonth,
                SalesYear = salesYear,
                TotalClients = totalClients,
                LastOrders = GetLastOrders(5),
                SalesCategory = GetSalesByCategory()
            };
        }

        public List<SalesCategory> GetSalesByCategory()
        {
            return _context.Orders
                .Where(o => o.Status == "Concluído")
                .SelectMany(o => o.Products)
                .GroupBy(p => p.ProductName)
                .Select(g => new SalesCategory
                {
                    Category = g.Key,
                    Sales = g.Count()
                })
                .ToList();
        }

        public List<LastOrders> GetLastOrders(int count = 5)
        {
            return _context.Orders
                .Where(o => o.Status == "Concluído")
                .OrderByDescending(o => o.Date)
                .Take(count)
                .Select(o => new LastOrders
                {
                    Id = o.Id,
                    Client = o.Client,
                    Status = o.Status,
                    Total = o.Total,
                    Date = o.Date,
                    Products = o.Products
                })
                .ToList();
        }
    }
}
