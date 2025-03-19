namespace Estoque.Backend.Models
{
    public class Product
    {
        public int id { get; set; }

        public string image { get; set; }
        public string name { get; set; }
        public decimal price { get; set; }

        public string category { get; set; }
        public int stock { get; set; }
    }
        public class ProductCreate
        {
            public string Name { get; set; }
            public decimal Price { get; set; }
            public string Category { get; set; }
            public int Stock { get; set; }
            public IFormFile Image { get; set; }

            public void Validate()
            {
                if (string.IsNullOrEmpty(Name))
                {
                    throw new Exception("Name is required");
                }

                if (Price <= 0)
                {
                    throw new Exception("Price must be greater than zero");
                }

                if (Image == null || Image.Length == 0)
                {
                    throw new Exception("Image is required");
                }
            }
        }
}