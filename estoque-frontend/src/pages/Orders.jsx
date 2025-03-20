import React, { useEffect, useState } from "react";
import "../styles/Orders.css";

const API_URL = import.meta.env.VITE_API_URL;

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState("Todos");
  const [showModal, setShowModal] = useState(false);
  const [inventoryProducts, setInventoryProducts] = useState([]);
  const [newOrder, setNewOrder] = useState({
    client: "",
    products: [{ product: null, price: 0 }],
    total: 0,
  });

  const statuses = ["Todos", "Pendente", "Em Andamento", "Concluído", "Cancelado"];

  useEffect(() => {
    fetch(`${API_URL}/orders`)
      .then(response => response.json())
      .then(data => setOrders(data))
      .catch(error => console.error("Erro ao buscar pedidos:", error));

    fetch(`${API_URL}/products`)
      .then(response => response.json())
      .then(data => setInventoryProducts(data))
      .catch(error => console.error("Erro ao buscar produtos:", error));
  }, []);

  const filteredOrders = selectedStatus === "Todos"
    ? orders
    : orders.filter(order => order.status === selectedStatus);

    const handleCompleteOrder = (id) => {
      fetch(`${API_URL}/orders/${id}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "Concluído" }),
      })
      .then(response => {
        if (!response.ok) {
          return response.json().then(err => { throw new Error(err.message); });
        }
        return response.json();
      })
      .then(() => {
        setOrders(orders.map(order => 
          order.id === id ? { ...order, status: "Concluído" } : order
        ));
      })
      .catch(error => console.error("Erro ao atualizar status:", error.message));
  };
  

  const handleDeleteOrder = (id) => {
    fetch(`${API_URL}/orders/${id}`, { method: "DELETE" })
      .then(() => {
        setOrders(orders.filter(order => order.id !== id));
      })
      .catch(error => console.error("Erro ao deletar pedido:", error));
  };

  const handleAddOrder = () => {
    if (!newOrder.client || newOrder.products.some(p => !p.product)) {
      alert("Preencha todos os campos.");
      return;
    }

    const total = newOrder.products.reduce((sum, p) => sum + (p.price || 0), 0);
    const orderData = {
      client: newOrder.client, 
      status: "Pendente",
      total: total,
      products: newOrder.products.map(p => ({
        productId: p.product?.id,
        productName: p.product?.name, 
        price: p.product?.price || 0,
        image: p.product?.image,
      }))
    };
    

    console.log("Dados enviados:", orderData); 

    fetch(`${API_URL}/orders`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(orderData),
    })
      .then(response => response.json())
      .then(newOrder => {
        setOrders([...orders, newOrder]);
        setShowModal(false);
        setNewOrder({ client: "", products: [{ product: null, price: 0 }] });
      })
      .catch(error => console.error("Erro ao adicionar pedido:", error));
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
      <img className="warehouse-img" src="/public/orders/warehouse.png" alt="" />
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
                <span className={`status ${String(order.status).toLowerCase()}`}>{order.status}</span>
              </td>
              <td>R$ {order.total.toFixed(2)}</td>
              <td>{order.date}</td>
              <td>
                <div className="order-products">
                  {order.products.map(product => (
                    <div key={product.id} className="product-info">
                      <img src={`http://localhost:5179${product.image}`} alt={product.name} className="product-image" />
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
                <button type="button" onClick={handleAddProductField}>Adicionar Produto</button>
              </div>
              <div className="total-price">
                <strong>Total: R$ {totalPrice.toFixed(2)}</strong>
              </div>
              <button type="button" onClick={handleAddOrder}>Adicionar Pedido</button>
              <button type="button" onClick={() => setShowModal(false)}>Fechar</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;
