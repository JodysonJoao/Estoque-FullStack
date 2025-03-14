namespace Estoque.Backend.Models
{
    public class Product
    {
        public int id { get; set; }

        public string image { get; set; }
        public string name { get; set; }
        public decimal price { get; set; }

        public int stock { get; set; }
    }

    public class ProductCreate
    {
        public string image { get; set; }
        public string name { get; set; }
        public decimal price { get; set; }

        public int stock { get; set; }

        public void Validate()
        {
            if (string.IsNullOrEmpty(name))
            {
                throw new Exception("Name is required");
            }

            if (price <= 0)
            {
                throw new Exception("Price is required");
            }

            if (string.IsNullOrEmpty(image))
            {
                throw new Exception("Image is required");
            }
        }
    }
}