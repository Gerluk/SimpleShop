import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { token, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav style={{ marginBottom: 20 }}>
      <NavLink to="/" end>Home</NavLink> |{" "}
      {token && (
        <>
          <NavLink to="/products" end>Products</NavLink> |{" "}
          <NavLink to="/products/create" end>Add Product</NavLink> |{" "}
          <NavLink to="/profile" end>Profile</NavLink>
          {user?.role === "admin" && <> | <NavLink to="/users">Users</NavLink></>}
          {" | "}
          <button onClick={handleLogout}>Logout</button>
        </>
      )}
      {!token && (
        <>
          <NavLink to="/login">Login</NavLink> |{" "}
          <NavLink to="/register">Register</NavLink>
        </>
      )}
    </nav>
  );
}