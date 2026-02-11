import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../features/auth/authSlice";
import { showSuccess } from "./Toast";

export default function Navbar() {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    // 🔥 read user from Redux
    const user = useSelector((state) => state.auth.user);
    const role = user?.role || user?.authorities?.[0] || null;

    const handleLogout = () => {
        dispatch(logout());
        showSuccess("Logged out successfully");
        navigate("/auth/login");
    };

    return (
        <nav className="bg-green-700 text-white px-6 py-3 flex justify-between">
            <Link to="/" className="font-bold text-lg">AgroBazaar</Link>

            <div className="space-x-4 flex items-center">

                {/* BEFORE LOGIN */}
                {!role && <Link to="/auth/login">Login</Link>}

                {/* ADMIN */}
                {role === "ADMIN" && (
                    <>
                        <Link to='/'>Products</Link>
                        <Link to="/admin-orders">Orders</Link>
                        <Link to="/add-product">Add Product</Link> 
                        <Link to="/admin">Admin Dashboard</Link>
                        <Link to="/profile">Profile</Link>
                        <button onClick={handleLogout}>Logout</button>
                    </>
                )}

                {/* FARMER */}
                {role === "FARMER" && (
                    <>
                        <Link to='/'>Products</Link>
                        <Link to="/farmer-orders">Orders</Link>
                        <Link to="/add-product">Add Product</Link> 
                        <Link to="/farmer">Farmer Dashboard</Link>
                        <Link to="/profile">Profile</Link>
                        <button onClick={handleLogout}>Logout</button>
                    </>
                )}

                {/* USER */}
                {role === "USER" && (
                    <>
                        <Link to='/'>Products</Link>
                        <Link to="/my-orders">Orders</Link>
                        <Link to="/cart">Cart</Link>
                        <Link to="/profile">Profile</Link>
                        <button onClick={handleLogout}>Logout</button>
                    </>
                )}
            </div>
        </nav>
    );
}
