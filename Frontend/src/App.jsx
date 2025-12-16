import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import ErrorBoundary from "./components/ErrorBoundary.jsx";
import Home from "./views/Home.jsx";
import ProductList from "./views/ProductList.jsx";
import ProductDetail from "./views/ProductDetail.jsx";
import ProductCreate from "./views/ProductCreate.jsx";
import ProductEdit from "./views/ProductEdit.jsx";
import Profile from "./views/Profile.jsx";
import UserList from "./views/UserList.jsx";
import Login from "./views/Login.jsx";
import Register from "./views/Register.jsx";
import { useAuth } from "./context/AuthContext.jsx";

function ProtectedRoute({ children }) {
  const { token } = useAuth();
  return token ? children : <Navigate to="/login" />;
}

export default function App() {
  return (
    <>
      <Navbar />
      <ErrorBoundary>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/products" element={
            <ProtectedRoute><ProductList /></ProtectedRoute>
          } />
          <Route path="/products/create" element={
            <ProtectedRoute><ProductCreate /></ProtectedRoute>
          } />
          <Route path="/products/:id" element={
            <ProtectedRoute><ProductDetail /></ProtectedRoute>
          } />
          <Route path="/products/:id/edit" element={
            <ProtectedRoute><ProductEdit /></ProtectedRoute>
          } />
          <Route path="/profile" element={
            <ProtectedRoute><Profile /></ProtectedRoute>
          } />
          <Route path="/users" element={
            <ProtectedRoute><UserList /></ProtectedRoute>
          } />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </ErrorBoundary>
    </>
  );
}