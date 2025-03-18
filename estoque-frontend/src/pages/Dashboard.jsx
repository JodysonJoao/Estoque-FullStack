import React from "react";
import { PieChart, Pie, Cell, Legend, Tooltip } from "recharts";
import "../styles/Dashboard.css";

const Dashboard = () => {
  const latestOrders = [
    { id: "1", produto: "Camiseta DryFit", cliente: "Nahia Colunga", localEntrega: "Texas, 77449", valor: "28,032" },
    { id: "2", produto: "Jump Sneaker Shoes", cliente: "Yara Barros", localEntrega: "New York, 92843", valor: "28,032" },
    { id: "2", produto: "Jump Sneaker Shoes", cliente: "Yara Barros", localEntrega: "New York, 92843", valor: "28,032" },
    { id: "2", produto: "Jump Sneaker Shoes", cliente: "Yara Barros", localEntrega: "New York, 92843", valor: "28,032" },
    { id: "2", produto: "Jump Sneaker Shoes", cliente: "Yara Barros", localEntrega: "New York, 92843", valor: "28,032" },
    { id: "2", produto: "Jump Sneaker Shoes", cliente: "Yara Barros", localEntrega: "New York, 92843", valor: "28,032" },
    { id: "2", produto: "Jump Sneaker Shoes", cliente: "Yara Barros", localEntrega: "New York, 92843", valor: "28,032" },
    { id: "3", produto: "XU-394 High Performance Shoes", cliente: "Jordi Santiago", localEntrega: "Denver, 34924", valor: "28,032" },
  ];

  const salesByCategory = [
    { name: "Shoes", vendas: 66, color: "#007bff" },
    { name: "Socks", vendas: 34, color: "#ffc107" },
  ];

  return (
    <div className="dashboard">
      <h1>Painel</h1>
      <div className="summary">
        <div className="summary-item">
        <h2>R$ 594.124</h2>
        <p>Receita Total</p>
          <span className="summary-change">+75 (5.5%)</span>
        </div>
        <div className="summary-item">
        <h2>436</h2>
        <p>Vendas esse Mês</p>
        </div>
        <div className="summary-item">
          <h2>539</h2>
          <p>Vendas esse Ano</p>
        </div>
        <div className="summary-item">
          <h2>401</h2>
          <p>Clientes esse mês</p>
        </div>
      </div>

      <div className="orders-and-categories">
        <div className="orders-container">
          <h2>Últimos Pedidos</h2>
          <table className="orders-table">
            <thead>
              <tr>
                <th>Pedido ID</th>
                <th>Data</th>
                <th>Produto</th>
                <th>Cliente</th>
                <th>Local de Entrega</th>
                <th>Status</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {latestOrders.map((order) => (
                <tr key={order.id}>
                  <td>#{order.id}</td>
                  <td>08 Mar, 2024</td>
                  <td>{order.produto}</td>
                  <td>{order.cliente}</td>
                  <td>{order.localEntrega}</td>
                  <td>Em Andamento</td>
                  <td>R$ {order.valor}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="categories-container">
          <h2>Top Pedidos</h2>
          {salesByCategory.map((item, index) => (
            <div className="category-item" key={index}>
              <span>{item.name}</span>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${item.vendas}%` }}></div>
              </div>
              <span>{item.vendas}%</span>
            </div>
          ))}
          <div className="category-chart">
            <h3>Categorias</h3>
            <PieChart width={250} height={250}>
              <Pie
                data={salesByCategory}
                dataKey="vendas"
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {salesByCategory.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
