import React from "react";
import ProductDetailClient from "./ProductDetailClient";
import { PRODUCTS } from "../../lib/aroast";

export async function generateStaticParams() {
  return PRODUCTS.map((p) => ({
    productId: String(p.id),
  }));
}

export default function ProductDetailPage({ params }) {
  return <ProductDetailClient params={params} />;
}
