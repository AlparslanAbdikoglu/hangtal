import { useEffect, useMemo, useRef, useState } from "react";

interface ProductSuggestion {
  id: number;
  name: string;
  price?: string;
  images?: { id: number; src: string }[];
}

interface UseProductSuggestionsResult {
  suggestions: ProductSuggestion[];
  loading: boolean;
  error: string;
  hasNoResults: boolean;
}

const createAuthHeader = () => {
  const consumerKey = import.meta.env.VITE_WOO_CONSUMER_KEY;
  const consumerSecret = import.meta.env.VITE_WOO_CONSUMER_SECRET;
  const apiUrl = import.meta.env.VITE_WOO_API_URL;

  return {
    authHeader: btoa(`${consumerKey}:${consumerSecret}`),
    apiUrl,
  };
};

export const useProductSuggestions = (
  rawSearchTerm: string,
  minimumLength = 2
): UseProductSuggestionsResult => {
  const searchTerm = rawSearchTerm.trim();
  const controllerRef = useRef<AbortController | null>(null);
  const [{ suggestions, loading, error }, setState] = useState<{
    suggestions: ProductSuggestion[];
    loading: boolean;
    error: string;
  }>({ suggestions: [], loading: false, error: "" });

  const { authHeader, apiUrl } = useMemo(createAuthHeader, []);

  useEffect(() => {
    if (controllerRef.current) {
      controllerRef.current.abort();
    }

    if (searchTerm.length < minimumLength) {
      setState({ suggestions: [], loading: false, error: "" });
      return;
    }

    const controller = new AbortController();
    controllerRef.current = controller;

    const fetchSuggestions = async () => {
      setState((prev) => ({ ...prev, loading: true, error: "" }));
      try {
        const res = await fetch(
          `${apiUrl}/products?per_page=8&search=${encodeURIComponent(searchTerm)}`,
          {
            signal: controller.signal,
            headers: { Authorization: `Basic ${authHeader}` },
          }
        );

        if (!res.ok) {
          throw new Error(`Failed to fetch suggestions for "${searchTerm}"`);
        }

        const data: ProductSuggestion[] = await res.json();
        setState({ suggestions: data, loading: false, error: "" });
      } catch (err) {
        if ((err as Error).name === "AbortError") return;
        setState({ suggestions: [], loading: false, error: (err as Error).message });
      }
    };

    void fetchSuggestions();

    return () => controller.abort();
  }, [apiUrl, authHeader, minimumLength, searchTerm]);

  return {
    suggestions,
    loading,
    error,
    hasNoResults: !loading && searchTerm.length >= minimumLength && suggestions.length === 0,
  };
};
