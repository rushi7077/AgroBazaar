import { useState } from "react";
import api from "../api/axios";
import { showSuccess, showError } from "../components/Toast";

export default function AddProduct() {
    const [form, setForm] = useState({
        name: "",
        price: "",
        quantity: "",
        categoryName: "",
    });

    const submit = async (e) => {
        e.preventDefault();

        try {
            await api.post("/api/products", {
                ...form,
                price: Number(form.price),
                quantity: Number(form.quantity),
            });

            showSuccess("Product added successfully");

            setForm({ name: "", price: "", quantity: "", categoryName: "" });
        } catch (err) {
            showError(err?.response?.data?.message || "Failed to add product");
        }
    };

    return (
        <div className="max-w-md mx-auto mt-8 p-6 border rounded-xl shadow">
            <h1 className="text-xl font-bold mb-4">Add Product</h1>

            <form onSubmit={submit} className="space-y-3">
                <input
                    className="border p-2 w-full"
                    placeholder="Product Name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                />

                <input
                    type="number"
                    className="border p-2 w-full"
                    placeholder="Price"
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                />

                <input
                    type="number"
                    className="border p-2 w-full"
                    placeholder="Quantity"
                    value={form.quantity}
                    onChange={(e) => setForm({ ...form, quantity: e.target.value })}
                />

                <input
                    className="border p-2 w-full"
                    placeholder="Category (e.g., Fruits)"
                    value={form.categoryName}
                    onChange={(e) =>
                        setForm({ ...form, categoryName: e.target.value })
                    }
                />

                <button className="bg-green-600 text-white w-full py-2 rounded">
                    Add Product
                </button>
            </form>
        </div>
    );
}
