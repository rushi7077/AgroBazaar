import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { showError } from "./Toast";
import { addToCart } from "../features/cart/cartSlice";


export default function ProductCard({ product, onDelete }) {
    const { user, token } = useSelector((s) => s.auth);
    const navigate = useNavigate();
    const dispatch = useDispatch();

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

        dispatch(addToCart(product));   // ⭐ REQUIRED
        navigate("/cart");              // then open cart
    };

       const isUser = role === "USER";


    return (
        <div className="border rounded-xl p-4 shadow space-y-2">
            <h2 className="font-bold text-lg">{product.name}</h2>
            <p>₹ {product.price}</p>

            {isUser && (
                <button
                    onClick={handleBuy}
                    className="bg-green-600 text-white px-3 py-1 rounded"
                >
                    Add to cart
                </button>
            )}

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
