import Image from "next/image";
import { getProducts } from '@/app/hooks/useProducts'

export default async function Home() {
    try {
        const products = await getProducts();
        
        return (
            <div className="flex flex-1 flex-col gap-4 p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {products.map((product) => (
                        <div key={product.id} className="bg-white rounded-xl shadow-md overflow-hidden">
                            <div className="p-4">
                                <h3 className="text-lg font-semibold text-gray-800">{product.name}</h3>
                                <p className="text-sm text-gray-500 mt-1">{product.category.name}</p>
                                <p className="text-gray-600 mt-2 line-clamp-2">{product.descriptions}</p>
                                <div className="mt-4">
                                    <span className="text-lg font-bold text-gray-900">
                                        ${product.price.toFixed(2)}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    } catch (error) {
        console.error('Error fetching products:', error);
        return (
            <div className="flex flex-1 items-center justify-center p-4">
                <p className="text-red-500">Error loading products. Please try again later.</p>
            </div>
        );
    }
}
