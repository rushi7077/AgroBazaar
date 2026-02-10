import { useDispatch, useSelector } from "react-redux";
import api from "../api/axios";
import { clearCart, removeFromCart } from "../features/cart/cartSlice";
import { showSuccess, showError } from "../components/Toast";

export default function Cart() {
    const dispatch = useDispatch();
    const { items } = useSelector(s => s.cart);

    const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

    const placeOrder = async () => {
        try {
            await api.post("/api/orders", {
                items: items.map(i => ({
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

    if (!items.length)
        return <p className="p-6">Cart is empty</p>;

    return (
        <div className="p-6 space-y-4">
            {items.map(i => (
                <div key={i.id} className="border p-4 flex justify-between">
                    <div>
                        <h2 className="font-bold">{i.name}</h2>
                        <p>Qty: {i.quantity}</p>
                    </div>

                    <div className="flex gap-2">
                        <p>₹{i.price * i.quantity}</p>
                        <button
                            onClick={() => dispatch(removeFromCart(i.id))}
                            className="bg-red-500 text-white px-3 py-1 rounded"
                        >
                            Remove
                        </button>
                    </div>
                </div>
            ))}

            <h2 className="text-xl font-bold">Total: ₹{total}</h2>

            <button
                onClick={placeOrder}
                className="bg-green-600 text-white px-6 py-2 rounded"
            >
                Checkout & Place Order
            </button>
        </div>
    );
}
