import React, { useState } from "react";
import "../styles/Inventory.css";

const Inventory = () => {

  const [products, setProducts] = useState([
    { id: 1, name: "Blusa Azul", price: 50, stock: 15, category: "Blusas", image: "https://picsum.photos/200" },
    { id: 2, name: "Short Preto", price: 80, stock: 10, category: "Shorts", image: "https://picsum.photos/200" },
    { id: 3, name: "Calça Jeans", price: 120, stock: 5, category: "Calças", image: "https://picsum.photos/200" }
  ]);
  
  const [selectedCategory, setSelectedCategory] = useState("Todos");

  const categories = ["Todos", "Blusas", "Shorts", "Calças", "Meias", "Blusas de Proteção", "Boné"];

  const filteredProducts = selectedCategory === "Todos"
    ? products
    : products.filter(product => product.category === selectedCategory);

  const GetStockStatus = (stock) => {
    if (stock > 10) return { status: "Em Estoque", className: "in-stock" };;
    if (stock <= 10 && stock > 0) return { status: "Estoque Baixo", className: "low-stock" };
    return { status: "Sem Estoque", className: "out-of-stock" };
  }

  const handleDelete = (id) => {
    setProducts(products.filter((product) => product.id !== id));
  }

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewProduct((prev) => ({ ...prev, image: file }));
    }
  };

  const [showModal, setShowModal] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: "",
    price: "",
    category: "Blusas",
    status: "",
    stock: "",
    image: null,
  });

  const handleChange = (e) => {
    setNewProduct({ ...newProduct, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newProduct.name || !newProduct.price || !newProduct.stock) return;

    const stockStatus = GetStockStatus(parseInt(newProduct.stock));

    const newEntry = {
      ...newProduct,
      id: products.length + 1,
      createdAt: new Date().toLocaleDateString(),
      status: stockStatus.status,
      statusClass: stockStatus.className,
      image: newProduct.image ? URL.createObjectURL(newProduct.image) : null,
    };

    setProducts([...products, newEntry]);
    setNewProduct({ name: "", price: "", status: "", stock: "", image: "" });
    setShowModal(false);
  };


  return (
    <div className="inventory-container">
      <div className="overload-container">
        <img className="overload-img" src="/public/inventory/overload.png" alt="" />
      </div>
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
            <th>Produto</th>
            <th>Preço</th>
            <th>Status</th>
            <th>Estoque</th>
            <th>Data de Criação</th>
          </tr>
        </thead>
        <tbody>
          {filteredProducts.map((product) => (
            <tr key={product.id}>
              <td>
                <div className="product-info">
                  {product.image && <img src={product.image} alt={product.name} className="product-image" />}
                  {product.name}
                </div>
              </td>
              <td>R$ {product.price}</td>
              <td className={product.statusClass}>{product.status}</td>
              <td>{product.stock}</td>
              <td>{product.createdAt}</td>
              <button className="delete-btn" onClick={() => handleDelete(product.id)}> 🗑️ Deletar </button>
            </tr>
          ))}
        </tbody>
      </table>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Adicionar produto</h2>
            <form onSubmit={handleSubmit}>
              <input type="text" name="name" placeholder="Nome do Produto" value={newProduct.name} onChange={handleChange} required />

              <input type="text" name="price" placeholder="Preço" value={newProduct.price} onChange={handleChange} required />

              <label>Categoria:</label>
              <select name="category" value={newProduct.category} onChange={handleChange}>
                {categories.slice(1).map((category) => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>

              <input type="number" name="stock" placeholder="Estoque" value={newProduct.stock} onChange={handleChange} required />

              <label>Imagem do Produto:</label>
              <input type="file" accept="image/*" onChange={handleImageUpload} />

              {newProduct.image && <img src={URL.createObjectURL(newProduct.image)} alt="Prévia" className="image-preview" />}

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
