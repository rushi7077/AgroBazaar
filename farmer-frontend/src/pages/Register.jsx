import { useState } from "react";
import { registerApi } from "../api/authApi";


export default function Register() {
    const [form, setForm] = useState({ name: "", email: "", password: "", role: "USER" });


    const submit = async (e) => {
        e.preventDefault();
        await registerApi(form);
        alert("Registered successfully");
    };


    return (
        <div className="flex justify-center items-center h-screen">
            <form onSubmit={submit} className="bg-white p-6 shadow rounded w-80">
                <h1 className="text-xl font-bold mb-4">Register</h1>
                <input className="border p-2 w-full mb-2" placeholder="Name" onChange={e => setForm({ ...form, name: e.target.value })} />
                <input className="border p-2 w-full mb-2" placeholder="Email" onChange={e => setForm({ ...form, email: e.target.value })} />
                <input type="password" className="border p-2 w-full mb-2" placeholder="Password" onChange={e => setForm({ ...form, password: e.target.value })} />
                <select className="border p-2 w-full mb-4" onChange={e => setForm({ ...form, role: e.target.value })}>
                    <option value="USER">USER</option>
                    <option value="FARMER">FARMER</option>
                </select>
                <button className="bg-green-600 text-white w-full py-2 rounded">Register</button>
            </form>
        </div>
    );
}