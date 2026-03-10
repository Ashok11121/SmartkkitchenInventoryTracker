import { useState } from "react";

export function Register({ onSwitch }) {
  const [formData, setFormData] = useState({ username: "", mobile: "", password: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch("http://localhost:5000/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });
    if (res.ok) {
      alert("Registered! Please login.");
      onSwitch();
    } else {
      alert("Error registering.");
    }
  };

  return (
    <div className="auth-box">
      <h2 style={{ marginBottom: 10 }}>Create account</h2>
      <form onSubmit={handleSubmit} style={{ display: "grid", gap: 10 }}>
        <input placeholder="Full Name" onChange={(e) => setFormData({...formData, username: e.target.value})} required />
        <input placeholder="Phone Number" onChange={(e) => setFormData({...formData, mobile: e.target.value})} required />
        <input type="password" placeholder="Password" onChange={(e) => setFormData({...formData, password: e.target.value})} required />
        <button type="submit" className="primary-btn">Sign Up</button>
      </form>
      <p style={{ marginTop: 12, color: "#cbd5e1" }}>Already have an account? <span style={{ color: "#818cf8", cursor: "pointer" }} onClick={onSwitch}>Login</span></p>
    </div>
  );
}

export function Login({ onLogin, onSwitch }) {
  const [formData, setFormData] = useState({ mobile: "", password: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch("http://localhost:5000/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });
    const data = await res.json();
    if (res.ok) {
      onLogin(data.token, data.user);
    } else {
      alert(data.error || data.message);
    }
  };

  return (
    <div className="auth-box">
      <h2 style={{ marginBottom: 10 }}>Welcome back</h2>
      <form onSubmit={handleSubmit} style={{ display: "grid", gap: 10 }}>
        <input placeholder="Phone Number" onChange={(e) => setFormData({...formData, mobile: e.target.value})} required />
        <input type="password" placeholder="Password" onChange={(e) => setFormData({...formData, password: e.target.value})} required />
        <button type="submit" className="primary-btn">Login</button>
      </form>
      <p style={{ marginTop: 12, color: "#cbd5e1" }}>Need an account? <span style={{ color: "#818cf8", cursor: "pointer" }} onClick={onSwitch}>Register</span></p>
    </div>
  );
}