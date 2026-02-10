import { Outlet, Link } from "react-router-dom";


export default function AuthLayout() {
    return (
        <div className="flex items-center justify-center h-screen bg-gray-100">
            <div className="bg-white p-6 rounded shadow w-96">
                <Outlet />
                <div className="mt-4 text-center text-sm">
                    <Link to="/auth/login" className="text-green-600 mr-3">Login</Link>
                    <Link to="/auth/register" className="text-green-600">Register</Link>
                </div>
            </div>
        </div>
    );
}