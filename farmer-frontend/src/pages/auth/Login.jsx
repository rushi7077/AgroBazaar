import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { loginUser } from "../../features/auth/authSlice";


export default function Login() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [form, setForm] = useState({ email: "", password: "" });


    const submit = async (e) => {
        e.preventDefault();
        await dispatch(loginUser(form));
        navigate("/");
    };


    return (
        <form onSubmit={submit}>
            <h1 className="text-xl font-bold mb-4">Login</h1>
            <input className="border p-2 w-full mb-2" placeholder="Email"
                onChange={(e) => setForm({ ...form, email: e.target.value })} />
            <input type="password" className="border p-2 w-full mb-4" placeholder="Password"
                onChange={(e) => setForm({ ...form, password: e.target.value })} />
            <button className="bg-green-600 text-white w-full py-2 rounded">Login</button>


            <p className="text-sm mt-3 text-center">
                No account? <Link to="/auth/register" className="text-green-600">Register</Link>
            </p>
        </form>
    );
}