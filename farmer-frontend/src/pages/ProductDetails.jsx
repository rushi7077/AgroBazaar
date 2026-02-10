import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getProductByIdApi } from "../api/productApi";


export default function ProductDetails() {
const { id } = useParams();
const [product, setProduct] = useState(null);


useEffect(() => { getProductByIdApi(id).then(r=>setProduct(r.data)); }, [id]);


if (!product) return <div className="p-6">Loading...</div>;


return (
<div className="p-6">
<h1 className="text-2xl font-bold">{product.name}</h1>
<p className="text-green-700">₹{product.price}</p>
<p>{product.category}</p>
</div>
);
}