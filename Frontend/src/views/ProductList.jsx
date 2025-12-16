import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import api from "../api/client";
import Loader from "../components/Loader";

export default function ProductList() {
  const [products, setProducts] = useState([]);
  const [meta, setMeta] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();

  const page = parseInt(searchParams.get("page") || "1");
  const limit = 10;
  const [category, setCategory] = useState(searchParams.get("category") || "");
  const [sort, setSort] = useState(searchParams.get("sort") || "price");

  useEffect(() => {
    setLoading(true);
    api.get("/products", {
      params: {
        page,
        limit,
        ...(category && { category }),
        sort
      }
    }).then(res => {
      setProducts(res.data.data);
      setMeta(res.data.meta);
      setError("");
    }).catch(err => {
      setError(err.response?.data?.message || err.message);
    }).finally(() => setLoading(false));
  }, [page, category, sort]);

  const handleCategory = (e) => {
    setCategory(e.target.value);
    setSearchParams({ page: 1, sort, category: e.target.value });
  };

  const handleSort = (e) => {
    setSort(e.target.value);
    setSearchParams({ page: 1, category, sort: e.target.value });
  };

  const handlePage = (newPage) => {
    setSearchParams({ page: newPage, category, sort });
  };

  if (loading) return <Loader />;
  if (error) return <div style={{ color: "red" }}>Error: {error}</div>;

  return (
    <div>
      <h2>Products</h2>
      <div>
        Category: <input value={category} onChange={handleCategory} placeholder="Category" />
        {" "}Sort: <select value={sort} onChange={handleSort}>
          <option value="price">Price ↑</option>
          <option value="-price">Price ↓</option>
          <option value="name">Name ↑</option>
          <option value="-name">Name ↓</option>
        </select>
      </div>
      <ul>
        {products.map(p =>
          <li key={p.id}>
            <Link to={`/products/${p.id}`}>{p.name}</Link> (${p.price}) by {p.creator?.email}
            {" "}
            <Link to={`/products/${p.id}/edit`}>Edit</Link>
          </li>
        )}
      </ul>
      <div>
        Page {meta.page} of {meta.pages}
        <button disabled={page <= 1} onClick={() => handlePage(page - 1)}>Prev</button>
        <button disabled={page >= meta.pages} onClick={() => handlePage(page + 1)}>Next</button>
      </div>
    </div>
  );
}