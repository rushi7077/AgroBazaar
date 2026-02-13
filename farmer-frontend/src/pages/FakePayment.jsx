import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useDispatch } from "react-redux";
import { clearCart } from "../features/cart/cartSlice";
import { showSuccess, showError } from "../components/Toast";

export default function FakePayment() {
    const { orderId } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handlePayment = async () => {
        try {
            await api.put(`/api/orders/${orderId}/pay`);

            dispatch(clearCart());   // ⭐ clear AFTER payment
            showSuccess("Payment successful");

            navigate("/my-orders");

        } catch (err) {
            showError("Payment failed");
        }
    };

    return (
        <div className="p-10 text-center space-y-4">
            <h1 className="text-2xl font-bold">Fake Payment Gateway</h1>
            <p>Order ID: {orderId}</p>

            <button
                onClick={handlePayment}
                className="bg-green-600 text-white px-6 py-2 rounded"
            >
                Pay Now
            </button>
        </div>
    );
}
