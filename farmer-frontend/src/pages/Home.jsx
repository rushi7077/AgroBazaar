import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchProducts } from "../features/products/productSlice";
import api from "../api/axios";
import { showSuccess, showError } from "../components/Toast";
import ProductCard from "../components/ProductCard";
import { addToCart } from "../features/cart/cartSlice";


export default function Home() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { items } = useSelector((s) => s.products);
    const { token, user } = useSelector((s) => s.auth);

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


        dispatch(addToCart(product));
        showSuccess("Added to cart");
    };

    const handleDelete = async (id) => {
        try {
            await api.delete(`/api/products/${id}`);
            showSuccess("Product deleted");
            dispatch(fetchProducts());
        } catch (err) {
            showError(err?.response?.data?.message || "Delete failed");
        }
    };

    return (
        <div className="grid grid-cols-3 gap-4 p-6">
            {items.map((p) => (
                <ProductCard
                    key={p.id}
                    product={p}
                    onBuy={handleBuy}
                    onDelete={handleDelete}
                    role={role}
                />
            ))}
        </div>
    );
}
