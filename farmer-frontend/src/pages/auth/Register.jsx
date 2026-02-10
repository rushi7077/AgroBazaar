import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { registerApi } from "../../api/authApi";


export default function Register() {
    const navigate = useNavigate();
    const [form, setForm] = useState({ name: "", email: "", password: "", role: "USER" });


    const submit = async (e) => {
        e.preventDefault();
        await registerApi(form);
        navigate("/auth/login");
    };


    return (
        <form onSubmit={submit}>
            <h1 className="text-xl font-bold mb-4">Register</h1>
            <input className="border p-2 w-full mb-2" placeholder="Name" onChange={e => setForm({ ...form, name: e.target.value })} />
            <input className="border p-2 w-full mb-2" placeholder="Email" onChange={e => setForm({ ...form, email: e.target.value })} />
            <input type="password" className="border p-2 w-full mb-2" placeholder="Password" onChange={e => setForm({ ...form, password: e.target.value })} />
            <select className="border p-2 w-full mb-4" onChange={e => setForm({ ...form, role: e.target.value })}>
                <option value="USER">USER</option>
                <option value="FARMER">FARMER</option>
            </select>
            <button className="bg-green-600 text-white w-full py-2 rounded">Register</button>


            <p className="text-sm mt-3 text-center">
                Already have account? <Link to="/auth/login" className="text-green-600">Login</Link>
            </p>
        </form>
    );
}