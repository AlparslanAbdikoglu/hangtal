import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import { DEFAULT_CURRENCY, formatMoney, getCurrencyInfo } from "@/utils/currency";

// --- Types ---
interface Product {
  id: number;
  name: string;
  price: string;
  regular_price?: string;
  sale_price?: string;
  quantity?: number;
  images?: { src: string }[];
  currency?: string;
  currency_code?: string;
  currency_symbol?: string;
  prices?: { currency_code?: string; currency_symbol?: string };
  meta_data?: { key: string; value: unknown }[];
  [key: string]: unknown;
}

interface UserData {
  id?: number;
  name?: string;
  email?: string;
  username?: string;
  [key: string]: unknown;
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
    currencyCode?: string;
    currencySymbol?: string;
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
  const { t } = useTranslation();

  // --- Setters ---
  const setPageLoading = useCallback((status: boolean) => setLoader(status), []);

  const renderProductPrice = (product: Product): JSX.Element => {
    const currency = getCurrencyInfo(product);
    const regular = parseFloat((product.regular_price ?? product.price ?? "0").toString());
    const sale = product.sale_price ? parseFloat(product.sale_price.toString()) : undefined;

    if (sale !== undefined) {
      return (
        <>
          <span className="text-muted text-decoration-line-through">
            {formatMoney(regular, currency)}
          </span>{" "}
          <span className="text-danger">{formatMoney(sale, currency)}</span>
        </>
      );
    }

    return <>{formatMoney(regular, currency)}</>;
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
  const addProductsToCart = useCallback((product: Product) => {
    const cartFromStorage: Product[] = JSON.parse(localStorage.getItem("cart") || "[]");

    const currency = getCurrencyInfo(product);
    const normalizedQuantity =
      typeof product.quantity === "number" && product.quantity > 0 ? product.quantity : 1;
    const normalizedProduct: Product = {
      ...product,
      currency: product.currency || currency.code,
      currency_symbol: product.currency_symbol || currency.symbol,
      prices: product.prices || { currency_code: currency.code, currency_symbol: currency.symbol },
      quantity: normalizedQuantity,
    };

    const existingIndex = cartFromStorage.findIndex((item) => item.id === normalizedProduct.id);
    const updatedCart = [...cartFromStorage];

    if (existingIndex >= 0) {
      const existing = { ...updatedCart[existingIndex] };
      existing.quantity = (existing.quantity || 1) + normalizedQuantity;
      updatedCart[existingIndex] = existing;
    } else {
      updatedCart.push(normalizedProduct);
    }

    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    toast.success("Product added to Cart!");
  }, []);

  const removeItemsFromCart = (product: Product) => {
    if (window.confirm(t("cart.removeConfirm", "Are you sure you want to remove this item?"))) {
      const cartFromStorage: Product[] = JSON.parse(localStorage.getItem("cart") || "[]");
      const updatedCart = cartFromStorage.filter((item) => item.id !== product.id);

      setCart(updatedCart);
      localStorage.setItem("cart", JSON.stringify(updatedCart));
      toast.success(t("cart.removed", "Product removed from Cart!"));
    }
  };

  // --- New addToCart function ---
  const addToCart = useCallback(
    (item: {
      title: string;
      price: number;
      image: string;
      product_id: number | string;
      quantity?: number;
      variants?: Record<string, string>;
      currencyCode?: string;
      currencySymbol?: string;
    }) => {
      const currencyCode = item.currencyCode || DEFAULT_CURRENCY.code;
      const productToAdd: Product = {
        id: Number(item.product_id),
        name: item.title,
        regular_price: item.price.toString(),
        quantity: item.quantity || 1,
        images: [{ src: item.image }],
        price: "",
        currency: currencyCode,
        currency_symbol: item.currencySymbol,
        prices: { currency_code: currencyCode, currency_symbol: item.currencySymbol }
      };
      addProductsToCart(productToAdd);
    },
    [addProductsToCart]
  );

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
export const useMyStore = (): MyStoreContextType => useContext(MyStoreContext);
