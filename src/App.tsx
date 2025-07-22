import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { myStoreHook } from "./MyStoreContext";

import Products from "./pages/Products";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import MyOrders from "./pages/Myorders";
import MyAccount from "./pages/Myaccount";
import Auth from "./pages/Auth";
import Index from "./pages/Index";
import Contact from "./pages/Contact";
import About from "./pages/About";
import Privacy from "./pages/Privacy";
import Shipping from "./pages/Shipping";

        

function App() {
  const {
    setPageLoading,
    isAuthenticated,
    cart,
    addProductsToCart,
    loggedInUserData,
    clearCartItem,
  } = myStoreHook();

  return (
    <Router>
      <ToastContainer />

      <Routes>
        <Route path="/" element={<Index />} />
        <Route
          path="/products"
          element={
            <Products
              onAddToCart={addProductsToCart}
              setPageLoading={setPageLoading}
            />
          }
        />
        <Route path="/cart" element={<Cart />} />

        <Route
          path="/checkout"
          element={
            <Checkout
              loggedInUserData={JSON.stringify(loggedInUserData)}
              clearCartItem={clearCartItem} cartItems={[]}            />
          }
        />
        <Route
          path="/my-orders"
          element={
            <MyOrders
              setPageLoading={setPageLoading}
              loggedInUserData={JSON.stringify(loggedInUserData)}
            />
          }
        />
        <Route
          path="/my-account"
          element={<MyAccount loggedInUserData={JSON.stringify(loggedInUserData)}/>}
        />
       <Route path="/login" element={<Auth />} />

       
    
       
        {/* Static pages */}
        <Route path="/about" element={<About />} />
  <Route path="/contact" element={<Contact />} />
  <Route path="/privacy" element={<Privacy />} />
  <Route path="/shipping" element={<Shipping />} />

        {/* Optional fallback route */}
        <Route path="*" element={<Products onAddToCart={addProductsToCart} setPageLoading={setPageLoading} />} />
      </Routes>
    </Router>
  );
}

export default App;
