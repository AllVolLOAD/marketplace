import { useEffect, useMemo, useState } from "react";

export type ProductVariant = {
  id: string;
  sku: string;
  price: number;
  currency: string;
  stock: number;
  options: {
    size: string;
    color: string;
  };
};

export type Product = {
  id: string;
  title: string;
  description: string;
  slug: string;
  images: string[];
  categories: string[];
  tags: string[];
  variants: ProductVariant[];
};

type State = {
  products: Product[];
  loading: boolean;
  error: Error | null;
};

type RawVariant = {
  id?: string;
  _id?: string;
  sku?: string;
  price?: number;
  currency?: string;
  stock?: number;
  options?: { size?: string; color?: string };
};

type RawProduct = {
  id?: string;
  _id?: string;
  title?: string;
  description?: string;
  slug?: string;
  images?: string[];
  categories?: string[];
  tags?: string[];
  variants?: RawVariant[];
};

const initialState: State = {
  products: [],
  loading: true,
  error: null,
};

const fallbackProducts: Product[] = [
  {
    id: "fallback-1",
    title: "Denim Jacket",
    description: "Retro denim jacket",
    slug: "denim-jacket",
    images: ["https://dummyimage.com/640x480/111/fff&text=Denim%20Jacket"],
    categories: ["outerwear"],
    tags: ["denim"],
    variants: [],
  },
  {
    id: "fallback-2",
    title: "Logo Hoodie",
    description: "Warm hoodie",
    slug: "logo-hoodie",
    images: ["https://dummyimage.com/640x480/111/fff&text=Logo%20Hoodie"],
    categories: ["hoodies"],
    tags: ["warm", "brand"],
    variants: [],
  },
  {
    id: "fallback-3",
    title: "Classic Tee",
    description: "Soft cotton tee",
    slug: "classic-tee",
    images: ["https://dummyimage.com/640x480/111/fff&text=Classic%20Tee"],
    categories: ["tops"],
    tags: ["casual"],
    variants: [],
  },
];

const normalizeProducts = (payload: unknown): Product[] => {
  if (!Array.isArray(payload)) return [];
  return (payload as RawProduct[]).map((raw) => ({
    id: raw.id ?? raw._id ?? "",
    title: raw.title ?? "",
    description: raw.description ?? "",
    slug: raw.slug ?? "",
    images: Array.isArray(raw.images) ? raw.images : [],
    categories: Array.isArray(raw.categories) ? raw.categories : [],
    tags: Array.isArray(raw.tags) ? raw.tags : [],
    variants: Array.isArray(raw.variants)
      ? raw.variants.map((v) => ({
          id: v.id ?? v._id ?? "",
          sku: v.sku ?? "",
          price: Number(v.price ?? 0),
          currency: v.currency ?? "USD",
          stock: Number(v.stock ?? 0),
          options: {
            size: v.options?.size ?? "",
            color: v.options?.color ?? "",
          },
        }))
      : [],
  }));
};

export const useProducts = () => {
  const [{ products, loading, error }, setState] = useState<State>(initialState);
  const baseUrl =
    process.env.NEXT_PUBLIC_SERVER_URL ?? "http://localhost:4000";

  useEffect(() => {
    const controller = new AbortController();
    fetch(`${baseUrl.replace(/\/$/, "")}/api/products`, {
      signal: controller.signal,
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Fetch failed (${res.status})`);
        }
        return res.json();
      })
      .then((data) => {
        const normalized = normalizeProducts(data);
        setState({
          products: normalized.length ? normalized : fallbackProducts,
          loading: false,
          error: null,
        });
      })
      .catch((err) => {
        if (controller.signal.aborted) return;
        console.error("Products fetch failed, using fallback cards:", err);
        setState({
          products: fallbackProducts,
          loading: false,
          error: null,
        });
      });

    return () => controller.abort();
  }, []);

  const hasProducts = useMemo(() => products.length > 0, [products]);

  return {
    products,
    loading,
    error,
    hasProducts,
  };
};
