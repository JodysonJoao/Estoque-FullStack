using Estoque.Backend.Data;
using Estoque.Backend.Models;
using Microsoft.AspNetCore.Http;
using System.IO;

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

            var imagePath = SaveImageAsync(product.Image).Result;

               var newProduct = new Product
               {
                name = product.Name,
                price = product.Price,
                category = product.Category,
                image = imagePath,
                stock = product.Stock
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

        public async Task<string> SaveImageAsync(IFormFile file)
        {
            var fileName = Guid.NewGuid().ToString() + Path.GetExtension(file.FileName);
            var filePath = Path.Combine("uploads", fileName);

            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }

            return $"/uploads/{fileName}";
        }


        public Product Update(int id, ProductCreate productCreate)
        {
            var existingProduct = GetById(id);
            if (existingProduct == null)
            {
                throw new Exception("Product not found");
            }

            productCreate.Validate();

            existingProduct.name = productCreate.Name;
            existingProduct.price = productCreate.Price;
            existingProduct.category = productCreate.Category;
            existingProduct.stock = productCreate.Stock;

            if (productCreate.Image != null && productCreate.Image.Length > 0)
            {
                var fileName = Guid.NewGuid().ToString() + Path.GetExtension(productCreate.Image.FileName);
                var filePath = Path.Combine("uploads", fileName);

                if (!Directory.Exists("uploads"))
                {
                    Directory.CreateDirectory("uploads");
                }

                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    productCreate.Image.CopyTo(stream);
                }

                existingProduct.image = filePath;  
            }

            _context.SaveChanges();
            return existingProduct;
        }
    }
}
