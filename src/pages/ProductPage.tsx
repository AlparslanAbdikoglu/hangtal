import { useEffect, useMemo, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { useMyStore } from "@/MyStoreContext";

interface Product {
  id: number;
  name: string;
  type?: string;
  price: string;
  regular_price?: string;
  sale_price?: string;
  description?: string;
  short_description?: string;
  stock_status?: string;
  images: { id: number; src: string }[];
  attributes?: { id: number; name: string; options: string[] }[];
  meta_data?: { key: string; value: string }[];
  categories?: { id: number; name: string; slug: string }[];
  quantity?: number;
}

interface Variation {
  id: number;
  price: string;
  regular_price?: string;
  sale_price?: string;
  stock_status?: string;
  image?: { src?: string };
  attributes?: { id: number; name: string; option: string }[];
}

interface ProductPageProps {
  onAddToCart?: (product: Product) => void;
  setPageLoading?: (loading: boolean) => void;
}

const stripHtml = (html?: string) => {
  if (!html) return "";
  return html.replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim();
};

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("hu-HU", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 2,
  }).format(value);

const ProductPage = ({ onAddToCart, setPageLoading }: ProductPageProps) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addProductsToCart, setPageLoading: contextSetPageLoading } = useMyStore();

  const consumerKey = import.meta.env.VITE_WOO_CONSUMER_KEY;
  const consumerSecret = import.meta.env.VITE_WOO_CONSUMER_SECRET;
  const apiUrl = import.meta.env.VITE_WOO_API_URL;
  const auth = btoa(`${consumerKey}:${consumerSecret}`);

  const [product, setProduct] = useState<Product | null>(null);
  const [variations, setVariations] = useState<Variation[]>([]);
  const [selectedVariationId, setSelectedVariationId] = useState<number | null>(null);
  const [qty, setQty] = useState<number>(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  const isVariable = product?.type === "variable";

  const mergedSetPageLoading = useCallback(
    (status: boolean) => (setPageLoading ?? contextSetPageLoading)?.(status),
    [contextSetPageLoading, setPageLoading]
  );

  const addToCartHandler = useCallback(
    (item: Product) => {
      if (typeof onAddToCart === "function") {
        onAddToCart(item);
        return;
      }
      addProductsToCart(item);
    },
    [addProductsToCart, onAddToCart]
  );

  const selectedVariation = useMemo(() => {
    if (!selectedVariationId) return null;
    return variations.find((v) => v.id === selectedVariationId) ?? null;
  }, [selectedVariationId, variations]);

  const displayImage = useMemo(() => {
    const vImg = selectedVariation?.image?.src;
    return vImg || product?.images?.[0]?.src || "/placeholder.jpg";
  }, [product, selectedVariation]);

  const displayPrice = useMemo(() => {
    const base = parseFloat(product?.price ?? "0");
    const variationPrice = selectedVariation ? parseFloat(selectedVariation.price || "0") : null;
    return variationPrice ?? base;
  }, [product, selectedVariation]);

  const inStock = useMemo(() => {
    if (!product) return false;
    if (isVariable) {
      if (!selectedVariation) return false;
      return selectedVariation.stock_status === "instock";
    }
    return product.stock_status === "instock";
  }, [product, isVariable, selectedVariation]);

  const canAddToCart = useMemo(() => {
    if (!product) return false;
    if (isVariable && !selectedVariation) return false;
    if (!inStock) return false;
    return qty > 0;
  }, [product, isVariable, selectedVariation, inStock, qty]);

  const fetchAllVariations = useCallback(
    async (productId: number): Promise<Variation[]> => {
      const perPage = 100;
      let page = 1;
      const all: Variation[] = [];

      while (true) {
        const res = await fetch(
          `${apiUrl}/products/${productId}/variations?per_page=${perPage}&page=${page}`,
          { headers: { Authorization: `Basic ${auth}` } }
        );
        if (!res.ok) break;

        const chunk: Variation[] = await res.json();
        if (!Array.isArray(chunk) || chunk.length === 0) break;

        all.push(...chunk);
        if (chunk.length < perPage) break;
        page += 1;
      }

      return all;
    },
    [apiUrl, auth]
  );

  useEffect(() => {
    if (!id) {
      setError("Hiányzó termék azonosító.");
      setLoading(false);
      return;
    }

    let cancelled = false;

    const fetchProduct = async () => {
      try {
        setError("");
        setLoading(true);
        mergedSetPageLoading(true);

        const res = await fetch(`${apiUrl}/products/${id}`, {
          headers: { Authorization: `Basic ${auth}`, "Content-Type": "application/json" },
        });

        if (!res.ok) throw new Error("Nem sikerült betölteni a terméket.");

        const data: Product = await res.json();
        if (cancelled) return;

        setProduct(data);

        if (data.type === "variable") {
          const vars = await fetchAllVariations(data.id);
          if (cancelled) return;

          setVariations(vars);
          const firstInStock = vars.find((v) => v.stock_status === "instock") ?? vars[0] ?? null;
          setSelectedVariationId(firstInStock?.id ?? null);
        } else {
          setVariations([]);
          setSelectedVariationId(null);
        }
      } catch (e: any) {
        if (cancelled) return;
        setError(e?.message || "Hiba történt a termék betöltésekor.");
      } finally {
        if (cancelled) return;
        setLoading(false);
        mergedSetPageLoading(false);
      }
    };

    fetchProduct();

    return () => {
      cancelled = true;
    };
  }, [id, apiUrl, auth, fetchAllVariations, mergedSetPageLoading]);

  const handleAddToCart = useCallback(() => {
    if (!product || !canAddToCart) return;

    const cartProduct: Product = {
      ...product,
      quantity: qty,
      price: displayPrice.toString(),
      regular_price: displayPrice.toString(),
      images: product.images?.length ? product.images : [{ id: 0, src: displayImage }],
      meta_data: [
        ...(product.meta_data || []),
        ...(isVariable && selectedVariation
          ? [
              { key: "variation_id", value: String(selectedVariation.id) },
              {
                key: "variation",
                value:
                  selectedVariation.attributes?.map((a) => `${a.name}: ${a.option}`).join(", ") ||
                  `Variation #${selectedVariation.id}`,
              },
            ]
          : []),
      ],
    };

    addToCartHandler(cartProduct);
  }, [addToCartHandler, canAddToCart, displayImage, displayPrice, isVariable, product, qty, selectedVariation]);

  const renderDescription = (label: string, content?: string) => {
    if (!content) return null;
    return (
      <section className="rounded-xl border bg-card p-4">
        <h3 className="font-semibold mb-2">{label}</h3>
        <p className="text-sm leading-relaxed text-foreground/80">{stripHtml(content)}</p>
      </section>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        <main className="flex-grow p-10 text-center">Termék betöltése…</main>
        <Footer />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        <main className="flex-grow p-10 text-center space-y-4">
          <p className="text-red-600 font-semibold">{error || "A termék nem található."}</p>
          <div className="flex gap-3 justify-center">
            <button className="px-4 py-2 rounded border" onClick={() => navigate(-1)}>
              Vissza
            </button>
            <button className="px-4 py-2 rounded border" onClick={() => navigate("/products")}>
              Termékekhez
            </button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <main className="flex-grow">
        <div className="max-w-7xl mx-auto p-4 md:p-10 space-y-6">
          <div className="flex items-center gap-3 text-sm text-foreground/70">
            <button
              onClick={() => navigate(-1)}
              className="inline-flex items-center gap-1 text-primary hover:underline"
            >
              ← Vissza
            </button>
            <span>•</span>
            <span>{product.categories?.map((c) => c.name).join(", ") || "Termék"}</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-8">
            <div className="bg-card rounded-2xl border overflow-hidden shadow-sm">
              <div className="w-full h-[380px] md:h-[480px] bg-white flex items-center justify-center p-6">
                <img src={displayImage} alt={product.name} className="w-full h-full object-contain" loading="lazy" />
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <div className="bg-card rounded-2xl border p-5 shadow-sm space-y-3">
                <div className="flex items-start justify-between gap-4">
                  <h1 className="text-3xl font-bold leading-tight">{product.name}</h1>
                  <div className={`text-sm font-medium ${inStock ? "text-green-600" : "text-red-600"}`}>
                    {inStock ? "Készleten" : isVariable && !selectedVariation ? "Válassz változatot" : "Nincs készleten"}
                  </div>
                </div>

                <div className="text-3xl font-semibold text-primary">{formatCurrency(displayPrice)}</div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
                  <div className="rounded-lg border p-3 bg-background/60">
                    <div className="font-semibold">Biztonságos vásárlás</div>
                    <div className="text-foreground/70">100% elégedettségi garancia.</div>
                  </div>
                  <div className="rounded-lg border p-3 bg-background/60">
                    <div className="font-semibold">Gyors szállítás</div>
                    <div className="text-foreground/70">Ingyenes 30 000 Ft felett.</div>
                  </div>
                  <div className="rounded-lg border p-3 bg-background/60">
                    <div className="font-semibold">Megbízható ajánlás</div>
                    <div className="text-foreground/70">Meinl Sonic Energy nagykövet.</div>
                  </div>
                </div>

                {isVariable && variations.length > 0 && (
                  <div className="space-y-2">
                    <label className="block text-sm font-medium">Változat</label>
                    <select
                      className="border px-3 py-2 rounded w-full"
                      value={selectedVariationId ?? ""}
                      onChange={(e) => setSelectedVariationId(Number(e.target.value) || null)}
                    >
                      <option value="" disabled>
                        Válassz változatot…
                      </option>
                      {variations.map((v) => {
                        const attrs = v.attributes?.map((a) => `${a.name}: ${a.option}`).join(", ") || `#${v.id}`;
                        const price = parseFloat(v.price || "0");
                        const stock = v.stock_status === "instock" ? "Készleten" : "Nincs készleten";
                        return (
                          <option key={v.id} value={v.id}>
                            {attrs} — {formatCurrency(price)} — {stock}
                          </option>
                        );
                      })}
                    </select>
                  </div>
                )}

                <div className="flex flex-wrap items-center gap-4">
                  <div className="flex items-center border rounded">
                    <button
                      type="button"
                      className="px-3 py-2 hover:bg-muted"
                      onClick={() => setQty((q) => Math.max(1, q - 1))}
                    >
                      −
                    </button>
                    <input
                      type="number"
                      min={1}
                      value={qty}
                      onChange={(e) => setQty(Math.max(1, parseInt(e.target.value || "1", 10)))}
                      className="w-16 text-center py-2 outline-none"
                    />
                    <button
                      type="button"
                      className="px-3 py-2 hover:bg-muted"
                      onClick={() => setQty((q) => q + 1)}
                    >
                      +
                    </button>
                  </div>
                  <div className="text-sm text-foreground/70">Ingyenes szállítás 30 000 Ft felett</div>
                </div>

                <button
                  disabled={!canAddToCart}
                  onClick={handleAddToCart}
                  className={`w-full px-5 py-3 rounded-lg font-semibold transition shadow-sm ${
                    canAddToCart
                      ? "bg-primary text-primary-foreground hover:opacity-90"
                      : "bg-muted text-foreground/50 cursor-not-allowed"
                  }`}
                >
                  Kosárba
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {renderDescription("Rövid leírás", product.short_description)}
                {renderDescription("Leírás", product.description)}
              </div>

              {!!product.categories?.length && (
                <div className="rounded-xl border bg-card p-4 text-sm text-foreground/80">
                  <span className="font-medium">Kategóriák: </span>
                  {product.categories.map((c) => c.name).join(", ")}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ProductPage;
