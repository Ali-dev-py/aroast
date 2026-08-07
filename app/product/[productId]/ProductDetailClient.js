"use client";

import React, { useState, useEffect } from "react";
import { useAppState } from "../../components/AppState";
import { GRINDS, roastInfo, faNum } from "../../lib/aroast";
import { useProduct } from "../../lib/api";
import { Price, Bag, StatRow, IconArrow } from "../../components/UI";
import { notFound } from "next/navigation";

export default function ProductDetailClient({ params }) {
  const { productId } = params;
  const { addToCart } = useAppState();

  const { product, loading, error } = useProduct(productId);

  // Declare all hooks at the top of the component to comply with React Hook Rules (never after conditional early returns)
  const [selectedSize, setSelectedSize] = useState(product ? (product.sizes[1] || product.sizes[0]) : null);
  const [selectedGrind, setSelectedGrind] = useState(GRINDS[0]);
  const [quantity, setQuantity] = useState(1);
  const [cadence, setCadence] = useState(""); // Default to one-time purchase

  useEffect(() => {
    if (product && product.sizes && product.sizes.length > 0) {
      setSelectedSize(product.sizes[1] || product.sizes[0]);
    }
  }, [product]);

  if (loading) {
    return (
      <div className="view-anim" style={{ maxWidth: 1200, margin: "0 auto", padding: "100px 22px", direction: "rtl", textAlign: "center", color: "var(--muted)" }}>
        در حال بارگذاری اطلاعات محصول...
      </div>
    );
  }

  if (error) {
    return (
      <div className="view-anim" style={{ maxWidth: 1200, margin: "0 auto", padding: "100px 22px", direction: "rtl", textAlign: "center", color: "var(--red)" }}>
        {error}
      </div>
    );
  }

  if (!product || !selectedSize) {
    return notFound();
  }

  const info = roastInfo();

  function handleAddToCart() {
    addToCart(product, {
      grams: selectedSize.g,
      sizeLabel: faNum(selectedSize.g) + " گرم",
      grind: selectedGrind,
      qty: quantity,
      price: selectedSize.price,
      cadence: cadence ? `اشتراک ${cadence}` : "",
    });
  }

  return (
    <div className="view-anim" style={{ maxWidth: 1200, margin: "0 auto", padding: "0 22px 100px", direction: "rtl", textAlign: "right" }}>
      {/* Product top row */}
      <div className="r-stack" style={{ display: "grid", gridTemplateColumns: "1fr 1.2fr", gap: "60px", alignItems: "flex-start", marginBottom: "80px" }}>
        {/* Product Images/Bag Column */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "24px" }}>
          <div style={{ position: "relative" }}>
            <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: "300px", height: "300px", background: "radial-gradient(circle, rgba(216,38,44,0.18) 0%, transparent 70%)", filter: "blur(30px)", zIndex: -1 }} />
            <Bag product={product} w={240} weightLabel={`${selectedSize.g}G`} floaty />
          </div>
          {product.badge && <span className="chip on" style={{ fontSize: "13px" }}>{product.badge}</span>}
        </div>

        {/* Product Details/Interactive purchasing */}
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", flexWrap: "wrap", gap: "10px", marginBottom: "16px" }}>
            <div>
              <span className="eyebrow">{product.catLabel}</span>
              <h1 style={{ fontSize: "36px", fontWeight: "900", color: "var(--ink)" }}>قهوه {product.name}</h1>
              <span style={{ fontSize: "14px", color: "var(--faint)", fontFamily: "var(--mono)", letterSpacing: "0.15em" }}>{product.sku} / {product.nameEn}</span>
            </div>
            <Price value={selectedSize.price} size={28} red />
          </div>

          <p style={{ fontSize: "16px", color: "var(--muted)", lineHeight: "1.9", marginBottom: "36px" }}>
            {product.desc}
          </p>

          {/* Size picker */}
          <div style={{ marginBottom: "28px" }}>
            <span className="field-label">۱. وزن بسته قهوه را انتخاب کنید</span>
            <div style={{ display: "flex", gap: "12px" }}>
              {product.sizes.map((s) => (
                <button
                  key={s.g}
                  className={`chip ${selectedSize.g === s.g ? "on" : ""}`}
                  onClick={() => setSelectedSize(s)}
                  style={{ padding: "12px 24px" }}
                >
                  {faNum(s.g)} گرم
                </button>
              ))}
            </div>
          </div>

          {/* Grind picker */}
          <div style={{ marginBottom: "28px" }}>
            <span className="field-label">۲. نوع آسیاب قهوه متناسب با دم‌افزار خود را انتخاب کنید</span>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
              {GRINDS.map((g) => (
                <button
                  key={g}
                  className={`chip ${selectedGrind === g ? "on" : ""}`}
                  onClick={() => setSelectedGrind(g)}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>

          {/* Subscription Option (PRD v2 feature) */}
          <div style={{ marginBottom: "36px" }}>
            <span className="field-label">۳. نوع خرید را مشخص کنید</span>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }} className="r-stack-700">
              <button
                className="glass"
                onClick={() => setCadence("")}
                style={{
                  padding: "16px",
                  color: "var(--ink)",
                  borderColor: cadence === "" ? "var(--red)" : "rgba(255,255,255,0.1)",
                  background: cadence === "" ? "rgba(216,38,44,0.03)" : "rgba(255,255,255,0.02)",
                  cursor: "pointer",
                  textAlign: "right",
                }}
              >
                <strong style={{ display: "block", fontSize: "14.5px" }}>خرید یک مرتبه‌ای</strong>
                <span style={{ fontSize: "12px", color: "var(--muted)", marginTop: "4px", display: "block" }}>ارسال فوری طبق نوبت رُست هفتگی.</span>
              </button>

              <button
                className="glass"
                onClick={() => setCadence("ماهانه")}
                style={{
                  padding: "16px",
                  color: "var(--ink)",
                  borderColor: cadence === "ماهانه" ? "var(--red)" : "rgba(255,255,255,0.1)",
                  background: cadence === "ماهانه" ? "rgba(216,38,44,0.03)" : "rgba(255,255,255,0.02)",
                  cursor: "pointer",
                  textAlign: "right",
                }}
              >
                <strong style={{ display: "block", fontSize: "14.5px" }}>خرید اشتراکی (۱۰٪ تخفیف)</strong>
                <span style={{ fontSize: "12px", color: "var(--muted)", marginTop: "4px", display: "block" }}>شارژ خودکار و تحویل ماهانه درب منزل.</span>
              </button>
            </div>
          </div>

          {/* Add to cart block */}
          <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "14px", border: "1px solid var(--line-strong)", borderRadius: "999px", padding: "8px 16px" }}>
              <button onClick={() => quantity > 1 && setQuantity(quantity - 1)} style={{ background: "none", border: "none", color: "var(--muted)", fontSize: "20px", cursor: "pointer" }}>-</button>
              <span style={{ fontFamily: "var(--mono)", fontSize: "16px", fontWeight: "bold" }}>{faNum(quantity)}</span>
              <button onClick={() => setQuantity(quantity + 1)} style={{ background: "none", border: "none", color: "var(--muted)", fontSize: "16px", cursor: "pointer" }}>+</button>
            </div>

            <button onClick={handleAddToCart} className="btn btn-red btn-lg" style={{ flex: 1, display: "inline-flex" }}>
              <span>افزودن به سبد خرید</span>
              <Price value={selectedSize.price * quantity} size={15} />
            </button>
          </div>
        </div>
      </div>

      {/* Flavor Profile Stats & Info */}
      <div className="r-stack" style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: "60px", alignItems: "flex-start", borderTop: "1px solid var(--line)", paddingTop: "60px" }}>
        {/* Roast Profile */}
        <div>
          <h3 style={{ fontSize: "22px", fontWeight: "800", marginBottom: "24px" }}>شناسنامه طعمی قهوه</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <StatRow label="میزان برشته‌کاری (Roast)" en={product.roastLabel} value={product.roast} tone="red" />
            <StatRow label="اسیدیته / ترشی کنترل‌شده (Acidity)" en="Acidity" value={product.acidity} />
            <StatRow label="غلظت و بدنه فنجان (Body)" en="Body" value={product.body} />
            <StatRow label="شیرینی طبیعی طعم (Sweetness)" en="Sweetness" value={product.sweetness} />
            <StatRow label="میزان کافئین (Caffeine)" en="Caffeine" value={product.caffeine} />
          </div>
        </div>

        {/* Roast cycle info */}
        <div className="glass" style={{ padding: "32px", background: "rgba(255, 255, 255, 0.02)" }}>
          <h3 style={{ fontSize: "18px", fontWeight: "800", marginBottom: "20px" }}>چرخه برشته‌کاری این بچ</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "16px", fontSize: "14px" }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: "var(--muted)" }}>تاریخ آخرین برشته‌کاری</span>
              <strong>{info.roasted}</strong>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: "var(--muted)" }}>بهترین زمان استفاده تا</span>
              <strong>{info.bestBy}</strong>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: "var(--muted)" }}>فرآوری دانه سبز</span>
              <strong>{product.process}</strong>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: "var(--muted)" }}>کشور و خاستگاه</span>
              <strong>{product.origin}</strong>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", borderTop: "1px solid var(--line)", paddingTop: "14px", marginTop: "4px" }}>
              <span style={{ color: "var(--muted)" }}>نت‌های طعمی برجسته</span>
              <strong style={{ color: "var(--red)" }}>{product.notes.join(" • ")}</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
