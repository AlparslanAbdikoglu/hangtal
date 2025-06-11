import React from 'react';
import { SignedIn, SignedOut } from '@clerk/clerk-react';
import { useWooCommerceAuth } from '../hooks/useWooCommerceAuth';
import ProductList from '../components/ProductList';

const Products = () => {
    const { wooCommerceToken, wooCommerceUserId, loadingWooAuth, wooAuthError } = useWooCommerceAuth();

    return (
        <div style={{ padding: '20px' }}>
            <h2>Our Products</h2>

            {loadingWooAuth && <p>Authenticating with WooCommerce...</p>}
            {wooAuthError && <p style={{ color: 'orange' }}>WooCommerce authentication error: {wooAuthError.message || 'Unknown error'}. Please try signing in again.</p>}

            <SignedIn>
                {wooCommerceToken && wooCommerceUserId ? (
                    <>
                        <p>You are signed in with Clerk and authenticated with WooCommerce (WP User ID: {wooCommerceUserId}).</p>
                        <ProductList /> {/* Display products if authenticated */}
                    </>
                ) : (
                    !loadingWooAuth && !wooAuthError && <p>Please wait while we establish your WooCommerce session...</p>
                )}
            </SignedIn>

            <SignedOut>
                <p>Please sign in to view our products.</p>
                {/* You might want a SignInButton here too, or rely on the header button */}
            </SignedOut>
        </div>
    );
};

export default Products;