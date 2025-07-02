// Cart component with Stripe checkout
import React, { useState } from 'react';

const Cart = ({ cartItems, onUpdateCart }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleStripeCheckout = async () => {
        setIsLoading(true);
        setError(null);

        try {
            // Prepare cart data for Stripe
            const cartData = cartItems.map(item => ({
                product_id: item.id,
                variation_id: item.variation_id || null,
                quantity: item.quantity
            }));

            // Call your WooCommerce endpoint to create Stripe session
            const response = await fetch('http://api.lifeisnatural.eu/wp-json/wc/v3/stripe-checkout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    cart_items: cartData,
                    success_url: `${window.location.origin}/checkout/success`,
                    cancel_url: `${window.location.origin}/cart`
                })
            });

            const data = await response.json();

            if (response.ok) {
                // Redirect to Stripe hosted checkout
                window.location.href = data.checkout_url;
            } else {
                setError(data.error || 'Failed to create checkout session');
            }
        } catch (err) {
            setError('Network error occurred');
            console.error('Checkout error:', err);
        } finally {
            setIsLoading(false);
        }
    };

    const calculateTotal = () => {
        return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
    };

    return (
        <div className="cart-container">
            <h2>Shopping Cart</h2>
            
            {cartItems.length === 0 ? (
                <p>Your cart is empty</p>
            ) : (
                <>
                    <div className="cart-items">
                        {cartItems.map(item => (
                            <div key={item.id} className="cart-item">
                                <img src={item.image} alt={item.name} width="60" />
                                <div className="item-details">
                                    <h4>{item.name}</h4>
                                    <p>Price: ${item.price}</p>
                                    <p>Quantity: {item.quantity}</p>
                                    <p>Subtotal: ${(item.price * item.quantity).toFixed(2)}</p>
                                </div>
                                <button 
                                    onClick={() => onUpdateCart(item.id, 'remove')}
                                    className="remove-btn"
                                >
                                    Remove
                                </button>
                            </div>
                        ))}
                    </div>
                    
                    <div className="cart-summary">
                        <h3>Total: ${calculateTotal().toFixed(2)}</h3>
                        
                        {error && (
                            <div className="error-message">
                                {error}
                            </div>
                        )}
                        
                        <button 
                            onClick={handleStripeCheckout}
                            disabled={isLoading}
                            className="checkout-btn"
                        >
                            {isLoading ? 'Processing...' : 'Proceed to Checkout'}
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};

// Success page component
const CheckoutSuccess = () => {
    const [sessionId, setSessionId] = useState(null);

    React.useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        setSessionId(urlParams.get('session_id'));
    }, []);

    return (
        <div className="checkout-success">
            <h2>Payment Successful!</h2>
            <p>Thank you for your order. Your payment has been processed.</p>
            {sessionId && (
                <p>Session ID: {sessionId}</p>
            )}
            <a href="/">Continue Shopping</a>
        </div>
    );
};

// Example usage in your main app
const App = () => {
    const [cartItems, setCartItems] = useState([]);

    const updateCart = (productId, action) => {
        // Handle cart updates (add, remove, update quantity)
        if (action === 'remove') {
            setCartItems(cartItems.filter(item => item.id !== productId));
        }
        // Add more cart logic as needed
    };

    return (
        <div className="App">
            <Cart cartItems={cartItems} onUpdateCart={updateCart} />
        </div>
    );
};

export default App;