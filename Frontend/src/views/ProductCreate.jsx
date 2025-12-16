import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/client";

export default function ProductCreate() {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await api.post("/products", {
        name,
        category,
        price: Number(price)
      });
      navigate("/products");
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    }
  };

  return (
    <div>
      <h2>Add Product</h2>
      <form onSubmit={handleSubmit}>
        <input value={name} onChange={e => setName(e.target.value)} placeholder="Name" required />
        <input value={category} onChange={e => setCategory(e.target.value)} placeholder="Category" required />
        <input value={price} onChange={e => setPrice(e.target.value)} placeholder="Price" type="number" min="0" step="0.01" required />
        <button type="submit">Add</button>
      </form>
      {error && <div style={{ color: "red" }}>{error}</div>}
    </div>
  );
}