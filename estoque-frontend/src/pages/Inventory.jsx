import React from "react";
import "../styles/Inventory.css";

const Inventory = () => {

  return (
    <div className="inventory-container">
      <button className="add-product">Adicionar Produto</button>
      <div className="product-grid">
          <div key="" className="product-card">
            <img src="" alt="" className="product-image" />
            <h3></h3>
            <p>Preço: </p>
            <p>Tamanho: </p>
            <p>Estoque: </p>
          </div>
      </div>
    </div>
  );
};

export default Inventory;
