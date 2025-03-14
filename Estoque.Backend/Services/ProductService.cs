using Estoque.Backend.Data;
using Estoque.Backend.Models;

namespace Estoque.Backend.Services
{
    public class ProductService : IProductService
    {
        private readonly AppDbContext _context;

        public ProductService(AppDbContext context)
        {
            _context = context;
        }

        public List<Product> Get()
        {
            return _context.Products.ToList();
        }

        public Product GetById(int id) 
        {
            return _context.Products.FirstOrDefault(p => p.id == id);
        }

        public Product Create(ProductCreate product)
        {
            product.Validate();
            var newProduct = new Product
            {
                name = product.name,
                price = product.price,
                image = product.image,
                stock = product.stock
            };
            _context.Products.Add(newProduct);
            _context.SaveChanges();
            return newProduct;
        }

        public void Delete(int id)
        {
            var product = GetById(id);
            if (product == null)
            {
                throw new Exception("Product not found");
            }
            _context.Products.Remove(product);
            _context.SaveChanges();
        }

        public Product Update(int id, ProductCreate product)
        {
            var existingProduct = GetById(id);
            if (existingProduct == null)
            {
                throw new Exception("Product not found");
            }
            product.Validate();
            existingProduct.name = product.name;
            existingProduct.price = product.price;
            existingProduct.image = product.image;
            existingProduct.stock = product.stock;
            _context.SaveChanges();
            return existingProduct;
        }
    }
}
