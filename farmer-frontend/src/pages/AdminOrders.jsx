import { useEffect, useState } from "react";
import {
    getAllOrdersApi,
    decideItemApi,
    completeItemApi,
} from "../api/orderApi";
import { showSuccess, showError } from "../components/Toast";

export default function AdminOrders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    /* ================= LOAD ORDERS ================= */
    const loadOrders = async () => {
        try {
            setLoading(true);
            const data = await getAllOrdersApi(); // ⭐ already pure data
            setOrders(data);
        } catch (err) {
            console.error("Admin orders error:", err);
            showError("Failed to load orders");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadOrders();
    }, []);

    /* ================= EMPTY / LOADING ================= */
    if (loading) {
        return <p className="p-6 text-center font-semibold">Loading orders...</p>;
    }

    if (!orders.length) {
        return <p className="p-6 text-center font-semibold">No orders found</p>;
    }

    /* ================= UI ================= */
    return (
        <div className="max-w-5xl mx-auto p-6 space-y-4">
            <h1 className="text-2xl font-bold">All Orders (Admin)</h1>

            {orders.map((order) => (
                <div key={order.id} className="border rounded-xl p-4 shadow space-y-2">

                    {/* ORDER HEADER */}
                    <div className="flex justify-between font-semibold">
                        <span>Order #{order.displayOrderNo}</span>
                        <span>Status: {order.status}</span>
                    </div>

                    {/* USER INFO */}
                    <p className="text-sm text-gray-500">
                        User: {order.userName} ({order.userEmail})
                    </p>

                    {/* TOTAL */}
                    <p className="text-sm text-gray-500">
                        Total: ₹ {order.totalAmount}
                    </p>

                    {/* ITEMS */}
                    {order.items.map((item) => (
                        <div
                            key={item.id}
                            className="text-sm border-t pt-2 flex justify-between items-center"
                        >
                            <span>
                                {item.productName} × {item.quantity} (₹ {item.price})
                            </span>

                            {/* ACTION BUTTONS */}
                            <div className="flex gap-2">

                                {/* ACCEPT / REJECT */}
                                {item.status === "PENDING" && (
                                    <>
                                        <button
                                            onClick={async () => {
                                                try {
                                                    await decideItemApi(item.id, "ACCEPTED");
                                                    showSuccess("Item accepted");
                                                    loadOrders();
                                                } catch {
                                                    showError("Failed to accept item");
                                                }
                                            }}
                                            className="bg-green-600 text-white px-2 py-1 rounded"
                                        >
                                            Accept
                                        </button>

                                        <button
                                            onClick={async () => {
                                                try {
                                                    await decideItemApi(item.id, "REJECTED");
                                                    showSuccess("Item rejected");
                                                    loadOrders();
                                                } catch {
                                                    showError("Failed to reject item");
                                                }
                                            }}
                                            className="bg-red-600 text-white px-2 py-1 rounded"
                                        >
                                            Reject
                                        </button>
                                    </>
                                )}

                                {/* COMPLETE */}
                                {item.status === "ACCEPTED" && (
                                    <button
                                        onClick={async () => {
                                            try {
                                                await completeItemApi(item.id);
                                                showSuccess("Item completed");
                                                loadOrders();
                                            } catch {
                                                showError("Failed to complete item");
                                            }
                                        }}
                                        className="bg-blue-600 text-white px-2 py-1 rounded"
                                    >
                                        Complete
                                    </button>
                                )}

                            </div>
                        </div>
                    ))}
                </div>
            ))}
        </div>
    );
}
