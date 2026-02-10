export default function ProductCard({ product, onBuy, onDelete, role }) {
    return (
        <div className="border rounded-xl p-4 shadow">
            <h2 className="font-bold">{product.name}</h2>
            <p>₹{product.price}</p>

            <div className="flex gap-2 mt-2">
                {/* BUY */}
                <button
                    onClick={() => onBuy(product.id)}
                    className="bg-green-600 text-white px-3 py-1 rounded"
                >
                    Buy
                </button>

                {/* DELETE → ONLY ADMIN & FARMER */}
                {(role === "ADMIN" || role === "FARMER") && (
                    <button
                        onClick={() => onDelete(product.id)}
                        className="bg-red-600 text-white px-3 py-1 rounded"
                    >
                        Delete
                    </button>
                )}
            </div>
        </div>
    );
}
