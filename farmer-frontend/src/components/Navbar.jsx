import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "../features/auth/authSlice";
import { getRole } from "../utils/role";


export default function Navbar() {
    const dispatch = useDispatch();
    const role = getRole();


    return (
        <nav className="bg-green-700 text-white px-6 py-3 flex justify-between items-center">
            <Link to="/" className="font-bold text-lg">AgroBazaar</Link>


            <div className="space-x-4">
                <Link to="/">Home</Link>


                {!role && <Link to="/auth/login">Login</Link>}
                {!role && <Link to="/auth/register">Register</Link>}


                {role === "USER" && <Link to="/orders">My Orders</Link>}
                {role === "FARMER" && <Link to="/farmer">Farmer Panel</Link>}
                {role === "ADMIN" && <Link to="/admin">Admin Panel</Link>}


                {role && (
                    <button onClick={() => dispatch(logout())} className="bg-red-500 px-3 py-1 rounded">
                        Logout
                    </button>
                )}
            </div>
        </nav>
    );
}