import { useEffect, useState } from "react";
import { getMyOrdersApi } from "../api/orderApi";

export default function UserOrders() {
    const [orders, setOrders] = useState([]);

    const loadOrders = async () => {
        try {
            const res = await getMyOrdersApi();// ⭐ Axios response
            setOrders(res.data || []);            // ⭐ SAFE fallback
        } catch (err) {
            console.error("Orders error:", err);
            setOrders([]);                        // ⭐ prevent undefined
        }
    };

    useEffect(() => {
        loadOrders();
    }, []);

    /* ---------- EMPTY ---------- */
    if (!orders.length) {
        return (
            <p className="p-6 text-center font-semibold">
                No orders yet
            </p>
        );
    }

    /* ---------- UI ---------- */
    return (
        <div className="max-w-4xl mx-auto p-6 space-y-4">
            <h1 className="text-2xl font-bold">My Orders</h1>

            {orders.map((order) => (
                <div key={order.id} className="border rounded-xl p-4 shadow">

                    {/* HEADER */}
                    <div className="flex justify-between font-semibold">
                        <span>Order #{order.displayOrderNo}</span>
                        <span>Status: {order.status}</span>
                    </div>

                    {/* TOTAL */}
                    <p className="text-sm text-gray-500 mb-2">
                        Total: ₹ {order.totalAmount}
                    </p>

                    {/* ITEMS */}
                    {order.items?.map((item) => (
                        <div key={item.id} className="text-sm border-t pt-2">
                            {item.productName} × {item.quantity} (₹ {item.price}) — {item.status}
                        </div>
                    ))}
                </div>
            ))}
        </div>
    );
}
