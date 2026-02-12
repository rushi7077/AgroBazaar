import { useEffect, useState } from "react";
import api from "../api/axios";

export default function AdminOrders() {
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        api.get("/api/orders")
            .then((res) => setOrders(res.data))
            .catch((err) => console.error("Admin orders error:", err));
    }, []);

    if (!orders.length) {
        return <p className="p-6 text-center font-semibold">No orders found</p>;
    }

    return (
        <div className="max-w-5xl mx-auto p-6 space-y-4">
            <h1 className="text-2xl font-bold">All Orders (Admin)</h1>

            {orders.map((order) => (
                <div key={order.id} className="border rounded-xl p-4 shadow">
                    <div className="flex justify-between font-semibold">
                        <span>Order #{order.displayOrderNo}</span>
                        <span>Status: {order.status}</span>
                    </div>

                    <p className="text-sm text-gray-500">
                        User: {order.userName} ({order.userEmail})
                    </p>


                    <p className="text-sm text-gray-500">
                        Total: ₹ {order.totalAmount}
                    </p>

                    {order.items.map((item) => (
                        <div key={item.id} className="text-sm border-t pt-2">
                            {item.productName} × {item.quantity} (₹ {item.price})
                        </div>
                    ))}
                </div>
            ))}
        </div>
    );
}
