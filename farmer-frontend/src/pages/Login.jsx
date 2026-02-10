import { useState } from "react";
import { useDispatch } from "react-redux";
import { loginUser } from "../features/auth/authSlice";


export default function Login() {
    const dispatch = useDispatch();
    const [form, setForm] = useState({ email: "", password: "" });


    const submit = (e) => { e.preventDefault(); dispatch(loginUser(form)); };


    return (
        <div className="flex items-center justify-center h-screen bg-gray-100">
            <form onSubmit={submit} className="bg-white p-6 rounded shadow w-80">
                <h1 className="text-xl font-bold mb-4">Login</h1>
                <input className="border p-2 w-full mb-2" placeholder="Email"
                    onChange={(e) => setForm({ ...form, email: e.target.value })} />
                <input type="password" className="border p-2 w-full mb-4" placeholder="Password"
                    onChange={(e) => setForm({ ...form, password: e.target.value })} />
                <button className="bg-green-600 text-white w-full py-2 rounded">Login</button>
            </form>
        </div>
    );
}