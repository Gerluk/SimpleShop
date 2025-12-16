import { useAuth } from "../context/AuthContext";
import { useState } from "react";
import api from "../api/client";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const { user, setUser, logout } = useAuth();
  const [email, setEmail] = useState(user?.email || "");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleUpdate = async (e) => {
    e.preventDefault();
    setError(""); setMessage("");
    try {
      await api.patch("/users/me", { email, password: password || undefined });
      setUser({ ...user, email });
      setMessage("Updated!");
      setPassword("");
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Really delete your account?")) return;
    try {
      await api.delete("/users/me");
      logout();
      navigate("/register");
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    }
  };

  return (
    <div>
      <h2>Profile</h2>
      <form onSubmit={handleUpdate}>
        <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" type="email" required />
        <input value={password} onChange={e => setPassword(e.target.value)} placeholder="New password (optional)" type="password" minLength={8} />
        <button type="submit">Update</button>
      </form>
      {message && <div style={{ color: "green" }}>{message}</div>}
      {error && <div style={{ color: "red" }}>{error}</div>}
      <div>
        <button onClick={handleDelete} style={{ marginTop: 16, color: "red" }}>Delete Account</button>
      </div>
      <div style={{ marginTop: 16 }}>
        <b>ID:</b> {user?.id} <br />
        <b>Role:</b> {user?.role}
      </div>
    </div>
  );
}