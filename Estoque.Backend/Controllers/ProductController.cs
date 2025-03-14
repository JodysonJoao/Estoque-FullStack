using Microsoft.AspNetCore.Mvc;
using Estoque.Backend.Services;
using Estoque.Backend.Models;

namespace Estoque.Backend.Controllers
{
    [ApiController]
    [Route("products")]
    public class ProductController : ControllerBase
    {
        private readonly IProductService _productService;
        public ProductController(IProductService productService)
        {
            _productService = productService;
        }
        [HttpGet]
        public IActionResult Get()
        {
            return Ok(_productService.Get());
        }
        [HttpGet("{id}")]
        public IActionResult GetById(int id)
        {
            var product = _productService.GetById(id);
            if (product == null)
            {
                return NotFound();
            }
            return Ok(product);
        }
        [HttpPost]
        public IActionResult Create([FromBody] ProductCreate product)
        {
            try
            {
                var newProduct = _productService.Create(product);
                return CreatedAtAction(nameof(GetById), new { id = newProduct.id }, newProduct);
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }
        [HttpPut("{id}")]
        public IActionResult Update(int id, [FromBody] ProductCreate product)
        {
            try
            {
                var updatedProduct = _productService.Update(id, product);
                return Ok(updatedProduct);
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }
        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            try
            {
                _productService.Delete(id);
                return NoContent();
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }
    }
}
