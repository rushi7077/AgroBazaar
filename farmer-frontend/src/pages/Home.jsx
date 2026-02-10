import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchProducts } from "../features/products/productSlice";
import api from "../api/axios";
import { showSuccess, showError } from "../components/Toast";

export default function Home() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { items } = useSelector((s) => s.products);
    const { token } = useSelector((s) => s.auth);


    const role = user?.role;

    useEffect(() => {
        dispatch(fetchProducts());
    }, [dispatch]);

    const handleBuy = (id) => {
        if (!token) {
            showError("Please login first");
            navigate("/auth/login");
            return;
        }

        // future: add to cart or place order
        alert("Buying product id: " + id);
    };

    const handleDelete = async (id) => {
        try {
            await api.delete(`/api/products/${id}`);
            showSuccess("Product deleted");

            dispatch(fetchProducts()); // refresh list
        } catch (err) {
            showError(err?.response?.data?.message || "Delete failed");
        }
    };


    return (
        <div className="grid grid-cols-3 gap-4 p-6">
            {items.map((p) => (
                <div key={p.id} className="border p-4 rounded shadow">
                    <h2 className="font-bold">{p.name}</h2>
                    <p>₹ {p.price}</p>

                    <button
                        onClick={() => handleBuy(p.id)}
                        className="mt-2 bg-green-600 text-white px-4 py-2 rounded"
                    >
                        Buy
                    </button>
                </div>
            ))}
        </div>
    );
}
