import Image from "next/image";

export default async function Home() {
    return (
        <div className="flex flex-1 flex-col gap-4 p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-white rounded-xl shadow-md overflow-hidden">
                    <div className="p-4">
                        <h3 className="text-lg font-semibold text-gray-800">Loading...</h3>
                        <p className="text-sm text-gray-500 mt-1">Category</p>
                        <p className="text-gray-600 mt-2 line-clamp-2">Description</p>
                        <div className="mt-4">
                            <span className="text-lg font-bold text-gray-900">
                                $0.00
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
