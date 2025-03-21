using Estoque.Backend.Models;
using Microsoft.AspNetCore.Mvc;

namespace Estoque.Backend.Services
{
    public interface IOrderService
    {
        List<Order> Get();
        Order GetById(int id);
        Task<Order> CreateOrder(Order order);
        void UpdateStatus(int id, string status);
        void DeleteOrder (int orderId);
        OrdersData GetOrdersData();

        List<SalesCategory> GetSalesByCategory();

        List<LastOrders> GetLastOrders(int count = 5);
    }
}
