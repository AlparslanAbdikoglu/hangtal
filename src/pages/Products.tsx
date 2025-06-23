import React, { useEffect, useState } from 'react';
import { SignedIn, SignedOut } from '@clerk/clerk-react';
import { useWooCommerceAuth } from '../hooks/useWooCommerceAuth';
import { getPublicProducts } from '../api/woocommerce'; // Ensure this import is correct for unauthenticated product fetching

// Assuming you have a Product type interface or use 'any' for now
interface Product {
    id: number;
    name: string;
    price: string; // Or number, depending on your API response
    image?: string; // Optional image URL
    // Add other fields from your API response here
}

const Products = () => {
    // State for products data
    const [products, setProducts] = useState<Product[]>([]);
    const [loadingProducts, setLoadingProducts] = useState(true);
    const [productsError, setProductsError] = useState<Error | null>(null);

    // Get WooCommerce authentication status from the custom hook
    // This must be declared inside the functional component
    const { wooCommerceToken, wooCommerceUserId, loadingWooAuth, wooAuthError } = useWooCommerceAuth();

    // Effect to fetch public products when the component mounts
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoadingProducts(true);
                // Call the correct function for publicly accessible products
                const data: Product[] = await getPublicProducts();
                setProducts(data);
            } catch (err: any) {
                console.error("Failed to load products:", err);
                setProductsError(err instanceof Error ? err : new Error(String(err)));
            } finally {
                setLoadingProducts(false);
            }
        };

        fetchProducts();
    }, []); // Empty dependency array means this effect runs once after the initial render

    return (
        <div className="container mx-auto p-6 bg-white rounded-lg shadow-lg">
            <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Our Products</h1>

            {/* Display WooCommerce authentication status based on Clerk login */}
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 mb-6 text-blue-800">
                {loadingWooAuth && <p>Authenticating with WooCommerce...</p>}
                {wooAuthError && <p className="text-orange-600">WooCommerce authentication error: {wooAuthError.message || 'Unknown error'}. Please try signing in again.</p>}
                <SignedIn>
                    {wooCommerceToken && wooCommerceUserId ? (
                        <p>You are signed in with Clerk and authenticated with WooCommerce (WP User ID: <span className="font-semibold">{wooCommerceUserId}</span>).</p>
                    ) : (
                        // Only show this if we are done loading auth and there's no error, but token/userId are missing
                        !loadingWooAuth && !wooAuthError && <p>Please wait while we establish your WooCommerce session...</p>
                    )}
                </SignedIn>
                <SignedOut>
                    <p>You are currently signed out. Sign in via Clerk to access authenticated features.</p>
                </SignedOut>
            </div>

            {/* Display Products List (Publicly accessible) */}
            {loadingProducts ? (
                <p className="text-center text-xl text-gray-600">Loading products...</p>
            ) : productsError ? (
                <p className="text-center text-xl text-red-600">Error: {productsError.message}</p>
            ) : products.length === 0 ? (
                <p className="text-center text-xl text-gray-600">No products found.</p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {products.map((product) => (
                        <div key={product.id} className="bg-gray-50 rounded-lg shadow-sm overflow-hidden transform transition duration-300 hover:scale-105 hover:shadow-md">
                            {product.image && (
                                <img
                                    src={product.image}
                                    alt={product.name}
                                    className="w-full h-48 object-cover"
                                    onError={(e) => { e.currentTarget.src = 'https://placehold.co/400x300/e0e0e0/000000?text=No+Image'; }}
                                />
                            )}
                            {!product.image && (
                                <div className="w-full h-48 bg-gray-200 flex items-center justify-center text-gray-500">No Image</div>
                            )}
                            <div className="p-4">
                                <h3 className="text-lg font-semibold text-gray-900 mb-1">{product.name}</h3>
                                <p className="text-gray-700 mb-2">${product.price}</p>
                                {/* Add a simple button, or link to a product detail page */}
                                <button className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition duration-200">
                                    View Details
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Products;
