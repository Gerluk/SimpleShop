import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/client";

export default function ProductEdit() {
  const { id } = useParams();
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    api.get(`/products/${id}`)
      .then(res => {
        setName(res.data.name);
        setCategory(res.data.category);
        setPrice(res.data.price);
        setLoading(false);
      }).catch(err => {
        setError(err.response?.data?.message || err.message);
        setLoading(false);
      });
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await api.patch(`/products/${id}`, {
        name,
        category,
        price: Number(price)
      });
      navigate(`/products/${id}`);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    }
  };

  if (loading) return <div>Loading...</div>;
  return (
    <div>
      <h2>Edit Product</h2>
      <form onSubmit={handleSubmit}>
        <input value={name} onChange={e => setName(e.target.value)} placeholder="Name" required />
        <input value={category} onChange={e => setCategory(e.target.value)} placeholder="Category" required />
        <input value={price} onChange={e => setPrice(e.target.value)} placeholder="Price" type="number" min="0" step="0.01" required />
        <button type="submit">Save</button>
      </form>
      {error && <div style={{ color: "red" }}>{error}</div>}
    </div>
  );
}