import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Orders from "./pages/Orders";
import FarmerDashboard from "./pages/FarmerDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import Profile from "./pages/Profile";
import Cart from "./pages/Cart";

import ProtectedRoute from "./components/ProtectedRoute";
import AuthLayout from "./pages/auth/AuthLayout";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import AddProduct from "./pages/AddProduct";   // NEW
import Cart from "./pages/Cart";



export default function App() {
    return (
        <BrowserRouter>
            <Navbar />

            {/* 🔥 REQUIRED FOR TOAST TO WORK */}
            <ToastContainer position="top-right" autoClose={2000} />

            <Routes>
                <Route path="/" element={<Home />} />

                <Route path="/auth" element={<AuthLayout />}>
                    <Route path="login" element={<Login />} />
                    <Route path="register" element={<Register />} />
                </Route>

                <Route path="/orders" element={<ProtectedRoute><Orders /></ProtectedRoute>} />
                <Route path="/farmer" element={<ProtectedRoute><FarmerDashboard /></ProtectedRoute>} />
                <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
                <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                <Route path="/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
                <Route
                    path="/add-product"
                    element={
                        <ProtectedRoute>
                            <AddProduct />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/cart"
                    element={
                        <ProtectedRoute>
                            <Cart />
                        </ProtectedRoute>
                    }
                />


            </Routes>
        </BrowserRouter>
    );
}
