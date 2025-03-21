import React, { useEffect, useState } from "react";
import { PieChart, Pie, Cell, Legend, Tooltip } from "recharts";
import "../styles/Dashboard.css";

const API_URL = import.meta.env.VITE_API_URL;

const Dashboard = () => {
  const [summary, setSummary] = useState(null);
  const [salesByCategory, setSalesByCategory] = useState([]);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetch(`${API_URL}/orders/dashboard`)
      .then(response => response.json())
      .then(data => {
        console.log("Dados recebidos:", data);
        setSummary(data);
        setSalesByCategory(data.salesCategory || []);
        setOrders(data.lastOrders || []);
      })
      .catch(error => console.error("Erro ao buscar dashboard:", error));
  }, []);

  const categoryColors = [
    "#4169E1",
    "#5D8AA8",
    "#2A4573",
    "#007B8C",
    "#6A5ACD",
    "#2E8B57",
  ];

  return (
    <div className="dashboard">
      <h1>Painel</h1>
      <div className="summary">
        <div className="summary-item">
          <h2>
            R${" "}
            {summary
              ? summary.totalRevenue.toFixed(2)
              : "Carregando..."}
          </h2>
          <p>Receita Total</p>
        </div>
        <div className="summary-item">
          <h2>
            {summary ? summary.salesMonth : "Carregando..."}
          </h2>
          <p>Vendas esse Mês</p>
        </div>
        <div className="summary-item">
          <h2>
            {summary ? summary.salesYear : "Carregando..."}
          </h2>
          <p>Vendas esse Ano</p>
        </div>
        <div className="summary-item">
          <h2>
            {summary ? summary.totalClients : "Carregando..."}
          </h2>
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
                <th>Status</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {orders && orders.length > 0 ? (
                orders.map((order) => (
                  <tr key={order.id}>
                    <td>#{order.id}</td>
                    <td>
                      {order.date}
                    </td>
                    <td>
                      {order.products
                        .map((p) => p.productName)
                        .join(", ")}
                    </td>
                    <td>{order.client}</td>
                    <td>{order.status}</td>
                    <td>R$ {order.total.toFixed(2)}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6">Carregando pedidos...</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="categories-container">
          <h2>Top Pedidos</h2>
          {salesByCategory && salesByCategory.length > 0 ? (
            salesByCategory.map((item, index) => (
              <div className="category-item" key={index}>
                <span>{item.category}</span>
                <div className="progress-bar">
                  <div
                    className="progress-fill"
                    style={{ width: `${item.sales}%` }}
                  ></div>
                </div>
                <span>{item.sales}</span>
              </div>
            ))
          ) : (
            <p>Carregando categorias...</p>
          )}

          <div className="category-chart">
            <h3>Pedidos</h3>
            {salesByCategory && salesByCategory.length > 0 ? (
              <PieChart width={300} height={300}>
                <Pie
                  data={salesByCategory}
                  dataKey="sales"
                  nameKey="category"
                  cx="50%"
                  cy="50%"
                  outerRadius={90}
                  fill="#8884d8"
                  label={({ name, percent }) =>
                    `${name}: ${(percent * 100).toFixed(0)}%`
                  }
                >
                  {salesByCategory.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={categoryColors[index % categoryColors.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            ) : (
              <p>Carregando gráfico...</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
