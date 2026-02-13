import { useEffect, useState } from "react";
import {
    getFarmerOrdersApi,
    decideItemApi,
    completeItemApi,
} from "../api/orderApi";
import { showSuccess, showError } from "../components/Toast";

export default function FarmerOrders() {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);

    /* ================= LOAD FARMER ITEMS ================= */
    const loadOrders = async () => {
        try {
            setLoading(true);
            const data = await getFarmerOrdersApi(); // ⭐ pure data
            setItems(data);
        } catch (err) {
            console.error("Farmer orders error:", err);
            showError("Failed to load farmer orders");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadOrders();
    }, []);

    /* ================= LOADING / EMPTY ================= */
    if (loading) {
        return <p className="p-6 text-center font-semibold">Loading orders...</p>;
    }

    if (!items.length) {
        return <p className="p-6 text-center font-semibold">No farmer orders</p>;
    }

    /* ================= UI ================= */
    return (
        <div className="max-w-4xl mx-auto p-6 space-y-4">
            <h1 className="text-2xl font-bold">Orders for My Products</h1>

            {items.map((item) => (
                <div
                    key={item.id}
                    className="border rounded-xl p-4 shadow flex justify-between items-center"
                >
                    {/* LEFT: PRODUCT INFO */}
                    <div>
                        <h2 className="font-semibold">{item.product.name}</h2>

                        <p className="text-sm text-gray-500">
                            Quantity: {item.quantity} | Price: ₹ {item.price}
                        </p>

                        <p className="text-sm font-medium mt-1">
                            Status: {item.status}
                        </p>
                    </div>

                    {/* RIGHT: ACTION BUTTONS */}
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
                                    className="bg-green-600 text-white px-3 py-1 rounded"
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
                                    className="bg-red-600 text-white px-3 py-1 rounded"
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
                                className="bg-blue-600 text-white px-3 py-1 rounded"
                            >
                                Complete
                            </button>
                        )}

                    </div>
                </div>
            ))}
        </div>
    );
}
