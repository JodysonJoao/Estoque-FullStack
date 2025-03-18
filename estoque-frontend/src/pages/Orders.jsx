import React, { useState } from "react";
import "../styles/Orders.css";

const Orders = () => {
  const inventoryProducts = [
  ];

  const [orders, setOrders] = useState([
  ]);

  const [selectedStatus, setSelectedStatus] = useState("Todos");
  const [showModal, setShowModal] = useState(false);
  const [newOrder, setNewOrder] = useState({
    client: "",
    products: [{ product: null, price: 0 }],
    total: 0
  });

  const statuses = ["Todos", "Pendente", "Em Andamento", "Concluído", "Cancelado"];

  const filteredOrders = selectedStatus === "Todos"
    ? orders
    : orders.filter(order => order.status === selectedStatus);

  const handleCompleteOrder = (id) => {
    setOrders(orders.map(order =>
      order.id === id ? { ...order, status: "Concluído" } : order
    ));
  };

  const handleDeleteOrder = (id) => {
    setOrders(orders.filter(order => order.id !== id));
  };

  const handleAddOrder = () => {
    if (!newOrder.client || newOrder.products.some(product => !product.product)) {
      alert("Por favor, preencha todos os campos corretamente.");
      return;
    }
  
    const total = newOrder.products.reduce((sum, product) => sum + (product.price || 0), 0);
  
    setOrders([
      ...orders,
      {
        id: orders.length + 1,
        client: newOrder.client,
        status: "Pendente",
        total: total,
        date: new Date().toLocaleDateString(),
        products: newOrder.products.map(p => p.product),
      }
    ]);
  
    setShowModal(false);
    setNewOrder({ client: "", products: [{ product: null, price: 0 }], total: 0 });
  };  


  const handleProductChange = (index, product) => {
    const updatedProducts = [...newOrder.products];
    updatedProducts[index].product = product;
    updatedProducts[index].price = product ? product.price : 0; 
    setNewOrder({ ...newOrder, products: updatedProducts });
  };

  const handlePriceChange = (index, price) => {
    const updatedProducts = [...newOrder.products];
    updatedProducts[index].price = parseFloat(price);
    setNewOrder({ ...newOrder, products: updatedProducts });
  };
  
  const handleAddProductField = () => {
    setNewOrder({
      ...newOrder,
      products: [...newOrder.products, { product: null, price: 0 }]
    });
  };  

  const totalPrice = newOrder.products.reduce((sum, product) => sum + product.price, 0);

  return (
    <div className="orders-container">
      <img className="warehouse-img"src="/public/orders/warehouse.png" alt="" />
      <div className="orders-header">
        <h1>Pedidos</h1>
        <button className="add-order-button" onClick={() => setShowModal(true)}>
          Adicionar Pedido
        </button>
        <div className="filter-container">
          <label>Filtrar por status:</label>
          <select value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)}>
            {statuses.map(status => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
        </div>
      </div>

      <table className="orders-table">
        <thead>
          <tr>
            <th>Cliente</th>
            <th>Status</th>
            <th>Total</th>
            <th>Data</th>
            <th>Produtos</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {filteredOrders.map(order => (
            <tr key={order.id}>
              <td>{order.client}</td>
              <td>
                <span className={`status ${order.status.toLowerCase()}`}>{order.status}</span>
              </td>
              <td>R$ {order.total.toFixed(2)}</td>
              <td>{order.date}</td>
              <td>
                <div className="order-products">
                  {order.products.map(product => (
                    <div key={product.id} className="product-info">
                      <img src={product.image} alt={product.name} className="product-image" />
                      <span>{product.name}</span>
                    </div>
                  ))}
                </div>
              </td>
              <td>
                {order.status !== "Concluído" && order.status !== "Cancelado" && (
                  <button className="complete-btn" onClick={() => handleCompleteOrder(order.id)}>✅ Concluir</button>
                )}
                <button className="delete-btn" onClick={() => handleDeleteOrder(order.id)}>❌ Deletar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Adicionar Pedido</h2>
            <form onSubmit={(e) => e.preventDefault()}>
              <input
                type="text"
                placeholder="Nome do Cliente"
                value={newOrder.client}
                onChange={(e) => setNewOrder({ ...newOrder, client: e.target.value })}
                required
              />
              <div className="product-selection">
                <label>Selecionar Produtos:</label>
                {newOrder.products.map((productField, index) => (
                  <div key={index} className="product-field">
                    <select
                      value={productField.product ? productField.product.id : ""}
                      onChange={(e) => handleProductChange(index, inventoryProducts.find(p => p.id === parseInt(e.target.value)))}
                    >
                      <option value="">Selecione um produto</option>
                      {inventoryProducts.map(product => (
                        <option key={product.id} value={product.id}>
                          {product.name} - R$ {product.price}
                        </option>
                      ))}
                    </select>
                    <input
                      type="number"
                      value={productField.price || 0}
                      onChange={(e) => handlePriceChange(index, e.target.value)}
                      placeholder="Preço"
                    />
                  </div>
                ))}
              </div>

              <button type="button" onClick={handleAddProductField}>Adicionar Produto</button>
              <h3>Total: R$ {totalPrice.toFixed(2)}</h3>
              <button onClick={handleAddOrder}>Adicionar Pedido</button>
              <button type="button" className="cancel-button" onClick={() => setShowModal(false)}>Cancelar</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;
