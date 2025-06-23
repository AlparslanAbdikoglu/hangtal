// my-webshop/frontend/src/hooks/useWooCommerceAuth.js

import { useState, useEffect, useCallback } from 'react';
import { useAuth, useUser } from '@clerk/clerk-react';
import { getWordPressToken } from '../api/auth';

export const useWooCommerceAuth = () => {
    const { isSignedIn, getToken } = useAuth();
    const { user } = useUser();
    const [wooCommerceToken, setWooCommerceToken] = useState(localStorage.getItem('woocommerce_jwt'));
    const [wooCommerceUserId, setWooCommerceUserId] = useState(localStorage.getItem('woocommerce_user_id'));
    const [loadingWooAuth, setLoadingWooAuth] = useState(true);
    const [wooAuthError, setWooAuthError] = useState(null);

    const authenticateWithWooCommerce = useCallback(async () => {
        // If user signs out or is not signed in with Clerk, clear WooCommerce auth data
        if (!isSignedIn || !user) {
            setWooCommerceToken(null);
            setWooCommerceUserId(null);
            localStorage.removeItem('woocommerce_jwt');
            localStorage.removeItem('woocommerce_user_id');
            setLoadingWooAuth(false);
            return;
        }

        // Check if we already have a token and user ID
        // (You might add logic here to validate expiry or refresh tokens)
        if (wooCommerceToken && wooCommerceUserId) {
            setLoadingWooAuth(false);
            return; // Already authenticated for WooCommerce
        }


        setLoadingWooAuth(true);
        setWooAuthError(null);

        try {
            // Get Clerk's session token for the backend to verify
            // Use a specific template if you configured one in Clerk for your backend
            const clerkSessionToken = await getToken({ template: 'wordpress_jwt_bridge' });

            if (!clerkSessionToken) {
                throw new Error('Clerk session token not available.');
            }

            // Call your WordPress bridge to exchange Clerk token for a WooCommerce JWT
            const data = await getWordPressToken(clerkSessionToken);

            if (data && data.token && data.user_id) {
                setWooCommerceToken(data.token);
                setWooCommerceUserId(data.user_id);
                localStorage.setItem('woocommerce_jwt', data.token);
                localStorage.setItem('woocommerce_user_id', data.user_id);
            } else {
                throw new Error('Invalid response from WooCommerce bridge: Missing token or user_id');
            }
        } catch (error) {
            console.error("Failed to authenticate with WooCommerce:", error);
            setWooAuthError(error);
            setWooCommerceToken(null);
            setWooCommerceUserId(null);
            localStorage.removeItem('woocommerce_jwt');
            localStorage.removeItem('woocommerce_user_id');
        } finally {
            setLoadingWooAuth(false);
        }
    }, [isSignedIn, user, getToken, wooCommerceToken, wooCommerceUserId]); // Include wooCommerceToken/UserId in deps for re-evaluation

    useEffect(() => {
        authenticateWithWooCommerce();
    }, [authenticateWithWooCommerce]);

    return { wooCommerceToken, wooCommerceUserId, loadingWooAuth, wooAuthError, authenticateWithWooCommerce };
};  