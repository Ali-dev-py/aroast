"use client";

import React, { useState } from "react";
import Link from "next/link";
import { DISCOVERY } from "../lib/aroast";
import { useProducts } from "../lib/api";
import { Price, Bag, SectionHead } from "../components/UI";

export default function Shop() {
  const { products, loading, error } = useProducts();
  const [catFilter, setCatFilter] = useState("all"); // 'all', 'core', 'rotating'

  const filteredProducts = products.filter((p) => {
    if (catFilter === "all") return true;
    return p.category === catFilter;
  });

  return (
    <div className="view-anim" style={{ maxWidth: 1200, margin: "0 auto", padding: "0 22px 100px", direction: "rtl", textAlign: "right" }}>
      <SectionHead
        eyebrow="فروشگاه برشته‌کاری آرُست"
        title="مجموعه قهوه‌های تخصصی ما"
        sub="کلیه قهوه‌ها به سفارش شما رُست شده و در گزینه آسیاب دلخواه ارسال خواهند شد."
      />

      {/* Categories filter chips */}
      <div style={{ display: "flex", gap: "12px", marginBottom: "48px", flexWrap: "wrap" }}>
        <button className={`chip ${catFilter === "all" ? "on" : ""}`} onClick={() => setCatFilter("all")}>
          همه قهوه‌ها ({Number(products.length).toLocaleString("fa-IR")})
        </button>
        <button className={`chip ${catFilter === "core" ? "on" : ""}`} onClick={() => setCatFilter("core")}>
          قهوه‌های امضایی آرُست
        </button>
        <button className={`chip ${catFilter === "rotating" ? "on" : ""}`} onClick={() => setCatFilter("rotating")}>
          تک‌خاستگاه / فصلی چرخشی
        </button>
      </div>

      {/* Products Grid */}
      {loading ? (
        <div style={{ textAlign: "center", padding: "60px", color: "var(--muted)" }}>
          در حال بارگذاری محصولات از سرور...
        </div>
      ) : error ? (
        <div style={{ textAlign: "center", padding: "60px", color: "var(--red)" }}>
          {error}
        </div>
      ) : (
        <div className="r-stack" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "24px" }} data-grid5>
          {filteredProducts.map((p) => (
            <Link
              key={p.id}
              href={`/product/${p.id}`}
              className="glass hover-grow"
              style={{
                display: "flex",
                flexDirection: "column",
                padding: "28px",
                textAlign: "right",
                color: "var(--ink)",
                transition: "transform 0.4s ease, border-color 0.4s ease",
              }}
            >
              <div style={{ display: "flex", justifyContent: "center", marginBottom: "24px" }}>
                <Bag product={p} w={140} />
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                <h3 style={{ fontSize: "20px", fontWeight: "800" }}>{p.name}</h3>
                <span className="chip" style={{ fontSize: "11.5px", padding: "4px 10px" }}>{p.catLabel}</span>
              </div>
              <p style={{ fontSize: "13.5px", color: "var(--muted)", lineHeight: "1.7", marginBottom: "20px", height: "46px", overflow: "hidden" }}>{p.tagline}</p>
              <div style={{ borderTop: "1px solid var(--line)", paddingTop: "14px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: "12.5px", color: "var(--faint)", fontFamily: "var(--mono)" }}>{p.sku}</span>
                <Price value={p.sizes && p.sizes[1] ? p.sizes[1].price : (p.sizes && p.sizes[0] ? p.sizes[0].price : 0)} size={15} />
              </div>
            </Link>
          ))}

          {/* Discovery Box Spec Card (Included inside grid) */}
          {catFilter !== "rotating" && (
            <Link
              href="/discovery"
              className="glass hover-grow"
              style={{
                display: "flex",
                flexDirection: "column",
                padding: "28px",
                textAlign: "right",
                color: "var(--ink)",
                borderColor: "rgba(216,38,44,0.25)",
                transition: "transform 0.4s ease, border-color 0.4s ease",
              }}
            >
              <div style={{ display: "flex", justifyContent: "center", marginBottom: "24px" }}>
                <Bag product={null} w={140} sticker="black" />
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                <h3 style={{ fontSize: "20px", fontWeight: "800" }}>{DISCOVERY.name}</h3>
                <span className="chip on" style={{ fontSize: "11px", padding: "4px 10px" }}>پک کاشف</span>
              </div>
              <p style={{ fontSize: "13.5px", color: "var(--muted)", lineHeight: "1.7", marginBottom: "20px", height: "46px", overflow: "hidden" }}>{DISCOVERY.tasteLine}</p>
              <div style={{ borderTop: "1px solid var(--line)", paddingTop: "14px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: "12.5px", color: "var(--faint)", fontFamily: "var(--mono)" }}>{DISCOVERY.nameEn}</span>
                <Price value={DISCOVERY.price} size={15} />
              </div>
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
