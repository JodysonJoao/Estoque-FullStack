using Estoque.Backend.Data;
using Estoque.Backend.Models;
using Estoque.Backend.Services;
using Microsoft.EntityFrameworkCore;

public class OrderService : IOrderService
{
    private readonly AppDbContext _context;

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
            {
                throw new Exception("Pedido não encontrado.");
            }

            if (order.Status != "Concluído")
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
        {
            throw new ArgumentException("Status inválido.");
        }

        var order = _context.Orders.FirstOrDefault(o => o.Id == id);
        if (order == null)
        {
            throw new InvalidOperationException("Pedido não encontrado.");
        }

        var validStatuses = new List<string> { "Pendente", "Em Andamento", "Concluído", "Cancelado" };
        if (!validStatuses.Contains(status))
        {
            throw new ArgumentException("Status inválido.");
        }

        order.Status = status;
        _context.Orders.Update(order);
        _context.SaveChanges();
    }


    public List<Order> Get()
    {
        return _context.Orders.Include(o => o.Products).ToList();
    }

    public Order GetById(int id)
    {
        return _context.Orders.Include(o => o.Products).FirstOrDefault(o => o.Id == id);
    }
}
