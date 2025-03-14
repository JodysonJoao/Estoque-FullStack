import React from "react";
import '../styles/Orders.css';

function Orders() {
  return (
    <div className="orders-container">
      <h1 className="orders-title">Orders</h1>
      <ul className="orders-list">
        <li>Pedido 1</li>
        <li>Pedido 2</li>
        <li>Pedido 3</li>
      </ul>
    </div>
  );
}

export default Orders;