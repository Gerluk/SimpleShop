import { useEffect, useState } from "react";
import api from "../api/client";

export default function UserList() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");
  const [formMsg, setFormMsg] = useState("");

  useEffect(() => {
    api.get("/users")
      .then(res => setUsers(res.data))
      .catch(err => setError(err.response?.data?.message || err.message))
      .finally(() => setLoading(false));
  }, []);

  const handleAddUser = async (e) => {
    e.preventDefault();
    setFormMsg("");
    try {
      await api.post("/auth/register", { email, password, role });
      setFormMsg("User added!");
      setEmail(""); setPassword(""); setRole("user");
      setLoading(true);
      api.get("/users")
        .then(res => setUsers(res.data))
        .catch(err => setError(err.response?.data?.message || err.message))
        .finally(() => setLoading(false));
    } catch (err) {
      setFormMsg(err.response?.data?.message || "Failed to add user");
    }
  };

  return (
    <div>
      <form onSubmit={handleAddUser} style={{ marginBottom: 24 }}>
        <h3>Add User (admin only)</h3>
        <input
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="Email"
          type="email"
          required
          style={{ marginRight: 8 }}
        />
        <input
          value={password}
          onChange={e => setPassword(e.target.value)}
          placeholder="Password"
          type="password"
          minLength={8}
          required
          style={{ marginRight: 8 }}
        />
        <select value={role} onChange={e => setRole(e.target.value)} style={{ marginRight: 8 }}>
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>
        <button type="submit">Add</button>
        {formMsg && <span style={{ marginLeft: 16 }}>{formMsg}</span>}
      </form>
      <h2>All Users (admin only)</h2>
      {loading ? <div>Loading...</div> : (
        error ? <div style={{ color: "red" }}>{error}</div> : (
          <table>
            <thead>
              <tr>
                <th>ID</th><th>Email</th><th>Role</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u.id}>
                  <td>{u.id}</td>
                  <td>{u.email}</td>
                  <td>{u.role}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )
      )}
    </div>
  );
}