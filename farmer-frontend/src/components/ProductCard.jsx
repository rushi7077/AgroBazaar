import { useNavigate } from "react-router-dom";


export default function ProductCard({ product }) {
    const navigate = useNavigate();


    const handleBuy = () => {
        const token = localStorage.getItem("token");
        if (!token) {
            navigate("/auth/login");
            return;
        }


        alert(`Proceeding to order for ${product.name}`);
    };


    return (
        <div className="border rounded-xl p-4 shadow hover:shadow-lg">
            <h2 className="font-bold text-lg">{product.name}</h2>
            <p className="text-green-700 font-semibold">₹{product.price}</p>
            <p className="text-sm text-gray-500">{product.category}</p>
            <button
                onClick={handleBuy}
                className="mt-2 bg-green-600 text-white px-3 py-1 rounded"
            >
                Buy
            </button>
        </div>
    );
}