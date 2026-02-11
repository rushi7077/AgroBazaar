import { useEffect, useState } from "react";
import { getMyOrdersApi } from "../api/orderApi";

export default function UserOrders() {
    const [orders, setOrders] = useState(null); // null = loading

    useEffect(() => {
        getMyOrdersApi()
            .then((res) => setOrders(res.data))
            .catch((err) => {
                console.error("Orders error:", err);
                setOrders([]); // prevent infinite loading
            });
    }, []);

    /* ---------- LOADING ---------- */
    if (orders === null) {
        return <p className="p-6 text-center font-semibold">Loading orders...</p>;
    }

    /* ---------- EMPTY ---------- */
    if (!orders.length) {
        return <p className="p-6 text-center font-semibold">No orders yet</p>;
    }

    /* ---------- LIST ---------- */
    return (
        <div className="max-w-4xl mx-auto p-6 space-y-4">
            <h1 className="text-2xl font-bold">My Orders</h1>

            {orders.map((order) => (
                <div key={order.id} className="border rounded-xl p-4 shadow">
                    <div className="flex justify-between font-semibold">
                        <span>Order #{order.id}</span>
                        <span>Status: {order.status}</span>
                    </div>

                    <p className="text-sm text-gray-500 mb-2">
                        Total: ₹ {order.totalAmount}
                    </p>

                    {order.items?.map((item) => (
                        <div key={item.id} className="text-sm border-t pt-2">
                            {item.product?.name} × {item.quantity} (₹ {item.price})
                        </div>
                    ))}
                </div>
            ))}
        </div>
    );
}
