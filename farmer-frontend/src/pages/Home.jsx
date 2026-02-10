import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "../features/products/productSlice";
import ProductCard from "../components/ProductCard";


export default function Home() {
    const dispatch = useDispatch();
    const { items } = useSelector((s) => s.products);


    useEffect(() => { dispatch(fetchProducts()); }, []);


    const buy = (p) => alert(`Order placed for ${p.name}`);


    return (
        <div className="p-6 grid md:grid-cols-3 gap-4">
            {items.map((p) => (
                <ProductCard key={p.id} product={p} onBuy={buy} />
            ))}
        </div>
    );
}