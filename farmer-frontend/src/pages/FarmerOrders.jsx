import { useEffect, useState } from "react";
import { getFarmerOrdersApi } from "../api/orderApi";

export default function FarmerOrders() {
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        getFarmerOrdersApi().then((res) => setOrders(res.data));
    }, []);

    if (!orders.length) {
        return <p className="p-6 text-center font-semibold">No farmer orders</p>;
    }

    return (
        <div className="max-w-4xl mx-auto p-6 space-y-4">
            <h1 className="text-2xl font-bold">Orders for My Products</h1>

            {orders.map((item) => (
                <div key={item.id} className="border rounded-xl p-4 shadow">
                    <div className="flex justify-between font-semibold">
                        <span>{item.product.name}</span>
                        <span>Status: {item.status}</span>
                    </div>

                    <p className="text-sm text-gray-500">
                        Quantity: {item.quantity} | Price: ₹ {item.price}
                    </p>
                </div>
            ))}
        </div>
    );
}
