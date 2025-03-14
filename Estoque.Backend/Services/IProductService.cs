using Estoque.Backend.Models;

namespace Estoque.Backend.Services
{
    public interface IProductService
    {
        List<Product> Get();
        Product GetById(int id);
        Product Create(ProductCreate product);
        Product Update(int id, ProductCreate product);
        void Delete(int id);
    }
}
