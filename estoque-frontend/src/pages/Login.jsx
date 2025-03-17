import React from "react";
import "../styles/Login.css";

function Login() {
  const handleSubmit = (event) => {
    event.preventDefault();
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <h1 className="login-title">Login</h1>
        <form className="login-form" onSubmit={handleSubmit}>
          <input className="username" type="text" name="username" placeholder="Username" />
          <input className="password" type="password" name="password" placeholder="Password" />
          <button type="submit">Login</button>
        </form>
      </div>
      <div className="delay-container">
        <img src="/login/delay.png" alt="" />
      </div>
    </div>
  );
}

export default Login;