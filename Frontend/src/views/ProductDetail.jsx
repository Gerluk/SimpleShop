import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/client";
import { useAuth } from "../context/AuthContext";

function ReviewForm({ productId, onAdd }) {
  const [rating, setRating] = useState("");
  const [comment, setComment] = useState("");
  const [error, setError] = useState("");
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await api.post("/reviews", { productId, rating: Number(rating), comment });
      onAdd(res.data);
      setRating(""); setComment("");
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    }
  };
  return (
    <form onSubmit={handleSubmit}>
      <select value={rating} onChange={e => setRating(e.target.value)} required>
        <option value="" disabled>Rating (1-5)</option>
        {[1,2,3,4,5].map(n => (
          <option key={n} value={n}>{n}</option>
        ))}
      </select>
      <input value={comment} onChange={e => setComment(e.target.value)} placeholder="Comment" required />
      <button type="submit">Add review</button>
      {error && <span style={{ color: "red" }}>{error}</span>}
    </form>
  );
}

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    api.get(`/products/${id}`)
      .then(res => {
        setProduct(res.data);
        setError("");
      })
      .catch(err => setError(err.response?.data?.message || err.message))
      .finally(() => setLoading(false));
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm("Delete this product?")) return;
    try {
      await api.delete(`/products/${id}`);
      navigate("/products");
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    }
  };

  const handleReviewAdd = (review) => {
    setProduct({ ...product, reviews: [...(product.reviews || []), review] });
    window.location.reload();
  };

  const handleReviewDelete = async (rid) => {
    if (!window.confirm("Delete this review?")) return;
    try {
      await api.delete(`/reviews/${rid}`);
      setProduct({ ...product, reviews: (product.reviews || []).filter(r => r.id !== rid) });
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error || !product) return <div style={{ color: "red" }}>{error || "Not found"}</div>;

  return (
    <div>
      <h2>{product.name}</h2>
      <p>Category: {product.category} | Price: ${product.price}</p>
      <p>Created by: {product.creator?.email}</p>
      {(user?.id === product.createdById || user?.role === "admin") && (
        <button onClick={handleDelete}>Delete Product</button>
      )}
      <h3>Reviews</h3>
      <ul>
        {(product.reviews || []).map(r =>
          <li key={r.id}>
            {r.rating}/5 by {r.author?.email || r.authorId} - {r.comment}
            {(user?.id === r.authorId || user?.role === "admin") && (
              <button onClick={() => handleReviewDelete(r.id)}>Delete</button>
            )}
          </li>
        )}
      </ul>
      <ReviewForm productId={product.id} onAdd={handleReviewAdd} />
    </div>
  );
}