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
  images?: { src: string }[];
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
  loggedInUserData: UserData | null;
  setLoggedInUserData: (data: UserData | null) => void;
  clearCartItem: () => void;
  addToCart: (item: {
    title: string;
    price: number;
    image: string;
    product_id: number | string;
    quantity?: number;
    variants?: Record<string, string>;
  }) => void;
}

// --- Context Setup ---
const MyStoreContext = createContext<MyStoreContextType>({} as MyStoreContextType);

// --- Provider ---
export const MyStoreProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [loader, setLoader] = useState(false);
  const [cart, setCart] = useState<Product[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loggedInUserData, setLoggedInUserData] = useState<UserData | null>(null);

  // --- Setters ---
  const setPageLoading = (status: boolean) => setLoader(status);

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

  const setUserLoggedInStatus = (status: boolean) => {
    setIsAuthenticated(status);
  };

  const setUserLogout = () => {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("user_data");
    setUserLoggedInStatus(false);
    setLoggedInUserData(null);
  };

  const clearCartItem = () => {
    localStorage.removeItem("cart");
    setCart([]);
  };

  // --- Cart Functions ---
  const addProductsToCart = (product: Product) => {
    const cartFromStorage: Product[] = JSON.parse(localStorage.getItem("cart") || "[]");

    const productExists = cartFromStorage.find((item) => item.id === product.id);

    if (productExists) {
      productExists.quantity = (productExists.quantity || 1) + (product.quantity || 1);
    } else {
      product.quantity = product.quantity || 1;
      cartFromStorage.push(product);
    }

    setCart([...cartFromStorage]);
    localStorage.setItem("cart", JSON.stringify(cartFromStorage));
    toast.success("Product added to Cart!");
  };

  const removeItemsFromCart = (product: Product) => {
    if (window.confirm("Are you sure want to remove?")) {
      const cartFromStorage: Product[] = JSON.parse(localStorage.getItem("cart") || "[]");
      const updatedCart = cartFromStorage.filter((item) => item.id !== product.id);

      setCart(updatedCart);
      localStorage.setItem("cart", JSON.stringify(updatedCart));
      toast.success("Product removed from Cart!");
    }
  };

  // --- New addToCart function ---
  const addToCart = (item: {
    title: string;
    price: number;
    image: string;
    product_id: number | string;
    quantity?: number;
    variants?: Record<string, string>;
  }) => {
    const productToAdd: Product = {
      id: Number(item.product_id),
      name: item.title,
      regular_price: item.price.toString(),
      quantity: item.quantity || 1,
      images: [{ src: item.image }],
      price: ""
    };
    addProductsToCart(productToAdd);
  };

  // --- Initial Load ---
  useEffect(() => {
    const token = localStorage.getItem("auth_token");
    if (token) setUserLoggedInStatus(true);

    const cartItems: Product[] = JSON.parse(localStorage.getItem("cart") || "[]");
    setCart(cartItems);

    const userData = localStorage.getItem("user_data");
    if (userData) {
      try {
        setLoggedInUserData(JSON.parse(userData));
      } catch {
        setLoggedInUserData(null);
      }
    }
  }, []);

  return (
    <MyStoreContext.Provider
      value={{
        loader,
        setPageLoading,
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
        addToCart,
      }}
    >
      {children}
    </MyStoreContext.Provider>
  );
};

// --- Custom Hook ---
export const myStoreHook = (): MyStoreContextType => useContext(MyStoreContext);
