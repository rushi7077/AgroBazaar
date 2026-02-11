import { useDispatch, useSelector } from "react-redux";
import api from "../api/axios";
import {
    clearCart,
    removeFromCart,
    increaseQty,
    decreaseQty,
} from "../features/cart/cartSlice";
import { showSuccess, showError } from "../components/Toast";

export default function Cart() {
    const dispatch = useDispatch();
    const { items } = useSelector((s) => s.cart);

    /* ---------- TOTAL PRICE ---------- */
    const total = items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
    );

    /* ---------- PLACE ORDER ---------- */
    const placeOrder = async () => {
        try {
            await api.post("/api/orders", {
                items: items.map((i) => ({
                    productId: i.id,
                    quantity: i.quantity,
                })),
            });

            dispatch(clearCart());
            showSuccess("Order placed successfully");
        } catch (err) {
            showError("Failed to place order");
        }
    };

    /* ---------- EMPTY CART ---------- */
    if (!items.length) {
        return (
            <p className="p-6 text-lg font-semibold text-center">
                Cart is empty
            </p>
        );
    }

    /* ---------- CART UI ---------- */
    return (
        <div className="max-w-3xl mx-auto p-6 space-y-4">
            <h1 className="text-2xl font-bold">Your Cart</h1>

            {/* PRODUCTS LIST */}
            {items.map((item) => (
                <div
                    key={item.id}
                    className="border rounded-xl p-4 flex justify-between items-center shadow"
                >
                    {/* LEFT: PRODUCT INFO */}
                    <div>
                        <h2 className="font-bold text-lg">{item.name}</h2>

                        <p className="text-gray-500 text-sm">
                            Category: {item.category}
                        </p>

                        {/* ➕➖ QUANTITY CONTROLS */}
                        <div className="flex items-center gap-3 mt-2">
                            <button
                                onClick={() => dispatch(decreaseQty(item.id))}
                                className="bg-red-500 text-white px-3 py-1 rounded"
                            >
                                −
                            </button>

                            <span className="font-semibold">{item.quantity}</span>

                            <button
                                onClick={() => dispatch(increaseQty(item.id))}
                                className="bg-green-600 text-white px-3 py-1 rounded"
                            >
                                +
                            </button>
                        </div>

                        <p className="font-semibold mt-1">₹ {item.price} each</p>
                    </div>

                    {/* RIGHT: PRICE + REMOVE */}
                    <div className="text-right space-y-2">
                        <p className="font-bold">
                            ₹ {item.price * item.quantity}
                        </p>

                        {/* ❌ DIRECT REMOVE */}
                        <button
                            onClick={() => dispatch(removeFromCart(item.id))}
                            className="bg-red-600 text-white px-3 py-1 rounded"
                        >
                            Remove
                        </button>
                    </div>
                </div>
            ))}

            {/* TOTAL */}
            <div className="text-right text-xl font-bold border-t pt-4">
                Total: ₹ {total}
            </div>

            {/* CHECKOUT BUTTON */}
            <div className="text-right">
                <button
                    onClick={() => {
                        console.log("button clicked");
                        placeOrder();                        
                    }}
                    className="bg-green-600 text-white px-6 py-2 rounded text-lg"
                >
                    Checkout & Place Order
                </button>
            </div>
        </div>
    );
}
