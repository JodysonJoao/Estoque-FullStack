import React from "react";
import { Link } from "react-router-dom";
import "../styles/Sidebar.css";

function Sidebar() {
  return (
    <div className="sidebar">
       <img className="caixas" src="/public/sidebar/quick-box.png" alt="caixas" />
      <ul>
        <li className="user">
          <Link to="/login">
            <img src="/public/sidebar/images/user.png" alt="User" />
          </Link>
        </li>
        <li className="inventory">
          <Link to="/inventory">
            <img src="/public/sidebar/images/inventory.png" alt="Inventory" />
          </Link>
        </li>
        <li className="orders">
          <Link to="/orders">
            <img src="/public/sidebar/images/shopping-cart.png" alt="Orders" />
          </Link>
        </li>
        <li className="histogram">
          <Link to="/dashboard">
            <img src="/public/sidebar/.sidebar/display-chart-up.png" alt="Dashboard" />
          </Link>
        </li>
      </ul>
    </div>
  );
}

export default Sidebar;
