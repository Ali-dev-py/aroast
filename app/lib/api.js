"use client";

import { useState, useEffect } from "react";

export function getApiBaseUrl() {
  if (typeof window !== "undefined") {
    const origin = window.location.origin;
    if (origin.includes("app.aprojects.ir") || origin.includes("localhost") || origin.includes("127.0.0.1")) {
      return "/api";
    }
  }
  return process.env.NEXT_PUBLIC_API_URL || "https://app.aprojects.ir/api";
}

let cachedProducts = null;
let fetchPromise = null;

export function useProducts() {
  const [products, setProducts] = useState(cachedProducts || []);
  const [loading, setLoading] = useState(!cachedProducts);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    async function loadProducts() {
      if (cachedProducts) {
        setProducts(cachedProducts);
        setLoading(false);
        return;
      }

      try {
        const baseUrl = getApiBaseUrl();
        if (!fetchPromise) {
          fetchPromise = fetch(`${baseUrl}/products`, {
            headers: {
              "Accept": "application/json"
            }
          }).then((res) => {
            if (!res.ok) throw new Error("Failed to fetch products");
            return res.json();
          });
        }

        const json = await fetchPromise;
        if (json && json.success && Array.isArray(json.data)) {
          cachedProducts = json.data;
          if (isMounted) {
            setProducts(cachedProducts);
            setLoading(false);
            setError(null);
          }
        } else {
          throw new Error("Invalid API response format");
        }
      } catch (err) {
        fetchPromise = null;
        if (isMounted) {
          setLoading(false);
          setError("خطا در برقراری ارتباط با سرور. لطفاً اتصال را بررسی کنید.");
        }
      }
    }

    loadProducts();

    return () => {
      isMounted = false;
    };
  }, []);

  return { products, loading, error };
}

export function useProduct(productId) {
  const { products, loading, error } = useProducts();
  const product = products.find((p) => p.id === productId) || null;

  return { product, loading, error };
}
