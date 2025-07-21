import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { toast } from "react-toastify";

// --- Types ---
interface Product {
  id: number;
  name: string;
  price: string;
  regular_price?: string;
  sale_price?: string;
  quantity?: number;
  [key: string]: any;
}

interface UserData {
  id?: number;
  name?: string;
  email?: string;
  username?: string;
  [key: string]: any;
}

interface MyStoreContextType {
  loader: boolean;
  setPageLoading: (status: boolean) => void;
  renderProductPrice: (product: Product) => JSX.Element;
  setUserLogout: () => void;
  isAuthenticated: boolean;
  setUserLoggedInStatus: (status: boolean) => void;
  cart: Product[];
  addProductsToCart: (product: Product) => void;
  removeItemsFromCart: (product: Product) => void;
  loggedInUserData: string; // Raw string from localStorage, used with JSON.parse
  setLoggedInUserData: (data: string) => void;
  clearCartItem: () => void;
}

interface ProviderProps {
  children: ReactNode;
}

// --- Context Setup ---
const MyStoreContext = createContext<MyStoreContextType>({} as MyStoreContextType);

// --- Provider ---
export const MyStoreProvider: React.FC<ProviderProps> = ({ children }) => {
  const [loader, setLoader] = useState(false);
  const [cart, setCart] = useState<Product[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loggedInUserData, setLoggedInUserData] = useState<string>("");

  const setPageLoading = (status: boolean) => {
    setLoader(status);
  };

  const renderProductPrice = (product: Product): JSX.Element => {
    if (product.sale_price) {
      return (
        <>
          <span className="text-muted text-decoration-line-through">
            ${product.regular_price}
          </span>{" "}
          <span className="text-danger">${product.sale_price}</span>
        </>
      );
    }
    return <>{`$${product.regular_price || product.price}`}</>;
  };

  useEffect(() => {
    const token = localStorage.getItem("auth_token");
    if (token) setUserLoggedInStatus(true);

    const cartItems = JSON.parse(localStorage.getItem("cart") || "[]");
    setCart(cartItems);

    const userData = localStorage.getItem("user_data");
    if (userData) setLoggedInUserData(userData);
  }, []);

  const addProductsToCart = (product: Product) => {
    const existingCart: Product[] = JSON.parse(localStorage.getItem("cart") || "[]");

    const productExists = existingCart.find((item) => item.id === product.id);

    if (productExists) {
      productExists.quantity = (productExists.quantity || 1) + 1;
    } else {
      product.quantity = 1;
      existingCart.push(product);
    }

    setCart([...existingCart]);
    localStorage.setItem("cart", JSON.stringify(existingCart));

    toast.success("Product added to Cart!");
  };

  const removeItemsFromCart = (product: Product) => {
    if (window.confirm("Are you sure want to remove?")) {
      const updatedCart = cart.filter((item) => item.id !== product.id);
      setCart(updatedCart);
      localStorage.setItem("cart", JSON.stringify(updatedCart));
      toast.success("Product removed from Cart!");
    }
  };

  const setUserLoggedInStatus = (status: boolean) => {
    setIsAuthenticated(status);
  };

  const setUserLogout = () => {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("user_data");
    setUserLoggedInStatus(false);
  };

  const clearCartItem = () => {
    localStorage.removeItem("cart");
    setCart([]);
  };

  return (
    <MyStoreContext.Provider
      value={{
        setPageLoading,
        loader,
        renderProductPrice,
        setUserLogout,
        isAuthenticated,
        setUserLoggedInStatus,
        cart,
        addProductsToCart,
        removeItemsFromCart,
        loggedInUserData,
        setLoggedInUserData,
        clearCartItem,
      }}
    >
      {children}
    </MyStoreContext.Provider>
  );
};

// --- Custom Hook ---
export const myStoreHook = (): MyStoreContextType => useContext(MyStoreContext);
