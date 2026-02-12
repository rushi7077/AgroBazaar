import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { showError } from "./Toast";

export default function ProductCard({ product, onDelete }) {
    const { user, token } = useSelector((s) => s.auth);
    const navigate = useNavigate();

    const role = user?.role;
    const userId = user?.id;

    // ⭐ FINAL RULE YOU ASKED
    const canDelete =
        product.farmerId &&
        (role === "ADMIN" || (role === "FARMER" && userId === product.farmerId));

    const handleBuy = () => {
        if (!token) {
            showError("Please login first");
            navigate("/auth/login");
            return;
        }

        navigate(`/cart?product=${product.id}`);
    };

    return (
        <div className="border rounded-xl p-4 shadow space-y-2">
            <h2 className="font-bold text-lg">{product.name}</h2>
            <p>₹ {product.price}</p>

            <button
                onClick={handleBuy}
                className="bg-green-600 text-white px-3 py-1 rounded"
            >
                Buy
            </button>

            {canDelete && (
                <button
                    onClick={() => onDelete(product.id)}
                    className="bg-red-600 text-white px-3 py-1 rounded ml-2"
                >
                    Delete
                </button>
            )}
        </div>
    );
}
