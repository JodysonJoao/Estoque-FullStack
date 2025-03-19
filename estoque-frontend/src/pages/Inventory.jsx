import React, { useEffect, useState } from "react";
import "../styles/Inventory.css";

const API_URL = import.meta.env.VITE_API_URL;

const Inventory = () => {
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const [showModal, setShowModal] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: "",
    price: "",
    category: "Blusas",
    stock: "",
    image: null,
  });

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`${API_URL}/products`);
        if (!response.ok) throw new Error("Erro ao buscar produtos");
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchProducts();
  }, []);

  const categories = ["Todos", "Blusas", "Shorts", "Calças", "Meias", "Blusas de Proteção", "Boné"];

  const filteredProducts =
    selectedCategory === "Todos"
      ? products
      : products.filter((product) => product.category === selectedCategory);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newProduct.name || !newProduct.price || !newProduct.stock || !newProduct.image) return;

    const formData = new FormData();
    formData.append("name", newProduct.name);
    formData.append("price", parseFloat(newProduct.price));
    formData.append("category", newProduct.category);
    formData.append("stock", parseInt(newProduct.stock));
    formData.append("image", newProduct.image);

    console.log("Enviando produto:", newProduct);

    try {
      const response = await fetch(`${API_URL}/products`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Erro ao adicionar produto");

      const savedProduct = await response.json();
      setProducts([...products, savedProduct]);
      setShowModal(false);
      setNewProduct({ name: "", price: "", stock: "", category: "Blusas", image: "" });

    } catch (error) {
      console.error(error);
    }
  };


  const handleDelete = async (id) => {
    try {
      const response = await fetch(`${API_URL}/products/${id}`, { method: "DELETE" });

      if (!response.ok) throw new Error("Erro ao deletar produto");

      setProducts(products.filter((product) => product.id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="inventory-container">
      <div className="inventory-header">
        <h1>Produtos</h1>
        <button className="add-product-button" onClick={() => setShowModal(true)}>
          Adicionar Produto
        </button>
      </div>

      <div className="filter-container">
        <label>Filtrar por categoria:</label>
        <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>

      <table className="product-table">
        <thead>
          <tr>
            <th>Imagem</th>
            <th>Produto</th>
            <th>Preço</th>
            <th>Categoria</th>
            <th>Estoque</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {filteredProducts.map((product) => (
            <tr key={product.id}>
              <td>
                {product.image ? (
                  <img src={`http://localhost:5179${product.image}`} alt={product.name} className="product-image" />
                ) : (
                  "Sem imagem"
                )}
              </td>
              <td>{product.name}</td>
              <td>R$ {product.price.toFixed(2)}</td>
              <td>{product.category}</td>
              <td>{product.stock}</td>
              <td>
                <button className="delete-btn" onClick={() => handleDelete(product.id)}> 🗑️ Deletar </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Adicionar Produto</h2>
            <form onSubmit={handleSubmit} encType="multipart/form-data">
              <input type="text" name="name" placeholder="Nome do Produto" value={newProduct.name} onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })} required />
              <input type="text" name="price" placeholder="Preço" value={newProduct.price} onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })} required />

              <label>Categoria:</label>
              <select name="category" value={newProduct.category} onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}>
                {categories.slice(1).map((category) => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>

              <input type="number" name="stock" placeholder="Estoque" value={newProduct.stock} onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })} required />

              <label>Imagem:</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setNewProduct({ ...newProduct, image: e.target.files[0] })}
              />

              <button type="submit">Adicionar Produto</button>
              <button type="button" className="cancel-button" onClick={() => setShowModal(false)}>Cancelar</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Inventory;
