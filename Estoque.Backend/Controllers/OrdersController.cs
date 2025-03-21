using Estoque.Backend.Models;
using Estoque.Backend.Services;
using Microsoft.AspNetCore.Mvc;

namespace Estoque.Backend.Controllers
{
    [ApiController]
    [Route("orders")]
    public class OrdersController : ControllerBase
    {
        private readonly IOrderService _orderService;

        public OrdersController(IOrderService orderService)
        {
            _orderService = orderService;
        }

        [HttpGet]
        public IActionResult GetOrders()
        {
            return Ok(_orderService.Get());
        }

        [HttpGet("dashboard")]
        public IActionResult GetDashboardData()
        {
            try
            {
                var ordersData = _orderService.GetOrdersData();
                return Ok(ordersData);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Erro ao buscar dados do dashboard: {ex.Message}");
            }
        }

        [HttpGet("{id}")]
        public IActionResult GetOrder(int id)
        {
            var order = _orderService.GetById(id);
            if (order == null) return NotFound();
            return Ok(order);
        }

        [HttpPost]
        public async Task<IActionResult> CreateOrder([FromBody] Order order)
        {
            if (order == null) return BadRequest();
            var result = await _orderService.CreateOrder(order);
            return Ok(result);
        }

        [HttpPut("{id}/status")]
        public IActionResult UpdateOrderStatus(int id, [FromBody] Dictionary<string, string> data)
        {
            if (!data.TryGetValue("status", out string status) || string.IsNullOrWhiteSpace(status))
            {
                return BadRequest(new { message = "Status inválido." });
            }

            try
            {
                _orderService.UpdateStatus(id, status);
                return Ok(new { message = "Status atualizado com sucesso!" });
            }
            catch (InvalidOperationException ex)
            {
                return NotFound(new { message = ex.Message });
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }


        [HttpDelete("{id}")]
        public IActionResult DeleteOrder(int id)
        {
            try
            {
                _orderService.DeleteOrder(id);
                return Ok();
            }
            catch (Exception ex)
            {
                return NotFound(new { message = ex.Message });
            }
        }
    }
}
