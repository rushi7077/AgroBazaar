import { useNavigate } from "react-router-dom";
import { getToken } from "../utils/token";
import { showError } from "./Toast";

export default function ProductCard({ product }) {
    const navigate = useNavigate();

    const handleBuy = () => {
        if (!getToken()) {
            showError("Login first to buy product");
            navigate("/auth/login");
            return;
        }

        navigate(`/cart?product=${product.id}`);
    };

    return (
        <div className="border rounded-xl p-4 shadow">
            <h2 className="font-bold">{product.name}</h2>
            <p>₹{product.price}</p>
            <button
                onClick={handleBuy}
                className="bg-green-600 text-white px-3 py-1 rounded mt-2"
            >
                Buy
            </button>
        </div>
    );
}
