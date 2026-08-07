"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { DEVICES, TASTES, SERVINGS, recommend } from "./lib/aroast";
import { useProducts } from "./lib/api";
import { Price, Bag, SectionHead, IconArrow, IconLeaf, IconClock, IconTruck, BWImage } from "./components/UI";

export default function Home() {
  const { products, loading, error } = useProducts();
  const coreProducts = products.filter((p) => p.category === "core");

  return (
    <div className="view-anim" style={{ maxWidth: 1200, margin: "0 auto", padding: "0 22px 100px" }}>
      {/* 1. HERO SECTION */}
      <section style={{ padding: "80px 0 100px", position: "relative" }} className="r-section r-pt-sm">
        {/* Background Large Red Logo */}
        <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: "100%", height: "100%", pointerEvents: "none", display: "flex", justifyContent: "center", alignItems: "center", overflow: "hidden", zIndex: -1 }}>
          <Image src="/assets/logo-red.png" alt="" width={450} height={300} style={{ opacity: 0.12, width: "38%", height: "auto", minWidth: "280px", maxWidth: "600px", objectFit: "contain" }} />
        </div>

        <div className="r-stack" style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: "60px", alignItems: "center" }}>
          <div style={{ textAlign: "right" }}>
            <div className="eyebrow" style={{ marginBottom: "16px" }}>برشته‌کاری تخصصی قهوه</div>
            <h1 style={{ fontSize: "52px", fontWeight: "900", lineHeight: "1.2", letterSpacing: "-0.01em", color: "var(--ink)", marginBottom: "20px" }}>
              رُست هفتگی، <br />
              <span className="gold-text">ارسال مستقیم و فوری.</span>
            </h1>
            <p style={{ fontSize: "17px", color: "var(--muted)", marginBottom: "36px", lineHeight: "1.9", maxWidth: "540px" }}>
              آرُست یک کارگاه برشته‌کاری مستقل در تهران است. ما دانه قهوه سبز مرغوب را هفتگی رُست می‌کنیم و با آسیابِ دلخواه و ارسال سریع به دست شما می‌رسانیم. قهوه‌ای که تازه رُست شده طعم‌ها را زنده نشان می‌دهد.
            </p>
            <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }} className="r-center">
              <Link href="/shop" className="btn btn-red btn-lg" style={{ display: "inline-flex" }}>
                <span>انتخاب قهوه تازه</span>
                <IconArrow size={18} />
              </Link>
              <Link href="/discovery" className="btn btn-lg" style={{ border: "1px solid var(--line-strong)", display: "inline-flex" }}>
                <span>پک کشف (Discovery Box)</span>
              </Link>
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "center", position: "relative" }}>
            {/* Ambient Red Blur behind Bag */}
            <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: "240px", height: "240px", background: "radial-gradient(circle, rgba(216,38,44,0.3) 0%, transparent 70%)", filter: "blur(20px)", zIndex: -1 }} />
            <Bag product={coreProducts[0]} w={240} floaty />
          </div>
        </div>
      </section>

      {/* 2. DELIVERY PROMISE (TICKER) */}
      <section style={{ marginBottom: "120px" }}>
        <div style={{ background: "rgba(255, 255, 255, 0.02)", border: "1px solid var(--line)", borderRadius: "var(--radius)", padding: "24px 40px" }} className="r-ph-20">
          <div className="r-stack" style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "40px" }}>
            <div style={{ display: "flex", alignItems: "flex-start", gap: "16px", direction: "rtl" }}>
              <div style={{ background: "rgba(216,38,44,0.08)", color: "var(--red)", borderRadius: "12px", padding: "12px" }}>
                <IconClock size={24} />
              </div>
              <div style={{ textAlign: "right" }}>
                <h4 style={{ fontSize: "16px", fontWeight: "700", color: "var(--ink)" }}>تحویل فوق‌سریع تهران</h4>
                <p style={{ fontSize: "13px", color: "var(--muted)", marginTop: "4px" }}>سفارش‌های قبل از ساعت ۱۶، همان روز ارسال می‌شوند.</p>
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "flex-start", gap: "16px", direction: "rtl" }}>
              <div style={{ background: "rgba(216,38,44,0.08)", color: "var(--red)", borderRadius: "12px", padding: "12px" }}>
                <IconLeaf size={24} />
              </div>
              <div style={{ textAlign: "right" }}>
                <h4 style={{ fontSize: "16px", fontWeight: "700", color: "var(--ink)" }}>تضمین نهایت تازگی</h4>
                <p style={{ fontSize: "13px", color: "var(--muted)", marginTop: "4px" }}>رُست هفتگی دانه قهوه و تاریخ درج شده فاکتور.</p>
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "flex-start", gap: "16px", direction: "rtl" }}>
              <div style={{ background: "rgba(216,38,44,0.08)", color: "var(--red)", borderRadius: "12px", padding: "12px" }}>
                <IconTruck size={24} />
              </div>
              <div style={{ textAlign: "right" }}>
                <h4 style={{ fontSize: "16px", fontWeight: "700", color: "var(--ink)" }}>ارسال رایگان</h4>
                <p style={{ fontSize: "13px", color: "var(--muted)", marginTop: "4px" }}>ارسال رایگان با خرید بالای ۵۰۰ گرم قهوه.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. SHOWCASE (CORE PRODUCTS) */}
      <section style={{ marginBottom: "120px" }}>
        <SectionHead
          eyebrow="مجموعه قهوه‌های آرُست"
          title="پنج طعم امضایی برای شروع"
          sub="از ۱۰۰٪ عربیکای لطیف کوهستان تا دارک رُست‌های سنگین و غنی اسپرسو."
        />

        {loading ? (
          <div style={{ textAlign: "center", padding: "40px", color: "var(--muted)" }}>
            در حال بارگذاری محصولات از سرور...
          </div>
        ) : error ? (
          <div style={{ textAlign: "center", padding: "40px", color: "var(--red)" }}>
            {error}
          </div>
        ) : (
          <div className="r-stack" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "24px" }} data-grid5>
            {coreProducts.slice(0, 3).map((p) => (
              <Link key={p.id} href={`/product/${p.id}`} className="glass hover-grow" style={{ display: "flex", flexDirection: "column", padding: "28px", textAlign: "right", color: "var(--ink)", transition: "transform 0.4s ease, border-color 0.4s ease" }}>
                <div style={{ display: "flex", justifyContent: "center", marginBottom: "24px" }}>
                  <Bag product={p} w={140} />
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                  <h3 style={{ fontSize: "20px", fontWeight: "800" }}>{p.name}</h3>
                  <span className="chip" style={{ fontSize: "11px", padding: "4px 10px" }}>{p.catLabel}</span>
                </div>
                <p style={{ fontSize: "13.5px", color: "var(--muted)", lineHeight: "1.7", marginBottom: "20px", height: "46px", overflow: "hidden" }}>{p.tagline}</p>
                <div style={{ borderTop: "1px solid var(--line)", paddingTop: "14px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: "12.5px", color: "var(--faint)", fontFamily: "var(--mono)" }}>{p.sku}</span>
                  <Price value={p.sizes && p.sizes[1] ? p.sizes[1].price : (p.sizes && p.sizes[0] ? p.sizes[0].price : 0)} size={15} />
                </div>
              </Link>
            ))}
          </div>
        )}

        <div style={{ display: "flex", justifyContent: "center", marginTop: "42px" }}>
          <Link href="/shop" className="btn btn-red" style={{ display: "inline-flex" }}>
            <span>مشاهده و خرید همه محصولات</span>
            <IconArrow size={16} />
          </Link>
        </div>
      </section>

      {/* 4. GUIDED SELECTOR (COFFEE RECOMMENDATION ENGINE) */}
      <section style={{ marginBottom: "120px" }}>
        <div className="glass" style={{ padding: "50px 40px", background: "linear-gradient(155deg, rgba(255,255,255,0.06), rgba(255,255,255,0.015))" }}>
          <GuidedSelector />
        </div>
      </section>

      {/* 5. STORY STRIP */}
      <section style={{ marginBottom: "100px" }} id="story-anchor">
        <div className="r-stack" style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: "60px", alignItems: "center" }}>
          <div style={{ textAlign: "right" }}>
            <div className="eyebrow" style={{ marginBottom: "12px" }}>هنر و علم برشته‌کاری</div>
            <h2 style={{ fontSize: "32px", fontWeight: "800", color: "var(--ink)", marginBottom: "20px" }}>داستان برشته‌کاری آرُست</h2>
            <p style={{ fontSize: "15.5px", color: "var(--muted)", lineHeight: "1.9", marginBottom: "24px" }}>
              آرُست از یک کارگاه کوچک خانگی با هدف دسترسی به طعم‌های بکر و تازه برشته شده شروع شد. در این کارگاه هر بچ (Batch) قهوه با پروفایل رُست منحصربه‌فرد برشته می‌شود تا ویژگی‌های خاستگاه دانه به اوج شفافیت خود برسند. ما قهوه را یک کالا نمی‌دانیم، بلکه حاصل زنجیره شگفت‌انگیز تلاش کشاورز تا فنجان نهایی شما می‌دانیم.
            </p>
            <Link href="/story" className="btn" style={{ display: "inline-flex" }}>
              <span>مطالعه داستان کامل ما</span>
              <IconArrow size={16} />
            </Link>
          </div>
          <div style={{ height: "300px", borderRadius: "var(--radius)", overflow: "hidden" }}>
            <BWImage id="home-story-1" label="تصویر سیاه‌و‌سفید کارگاه برشته‌کاری" style={{ borderRadius: "var(--radius)" }} />
          </div>
        </div>
      </section>
    </div>
  );
}

function GuidedSelector() {
  const [phase, setPhase] = useState("device"); // device -> taste -> serving -> result
  const [device, setDevice] = useState(null);
  const [taste, setTaste] = useState(null);
  const [serving, setServing] = useState(null);

  function reset() {
    setDevice(null);
    setTaste(null);
    setServing(null);
    setPhase("device");
  }

  function handleDevice(id) {
    setDevice(id);
    if (["mokapot", "turk", "filter"].includes(id)) {
      setPhase("result");
    } else {
      setPhase("taste");
    }
  }

  function handleTaste(id) {
    setTaste(id);
    setPhase("serving");
  }

  function handleServing(id) {
    setServing(id);
    setPhase("result");
  }

  const rec = (phase === "result") ? recommend(device, taste, serving) : null;
  const recProduct = rec ? products.find((p) => p.id === rec.id) : null;

  return (
    <div style={{ direction: "rtl", textAlign: "right" }}>
      <div style={{ textAlign: "center", marginBottom: "40px" }}>
        <div className="eyebrow" style={{ marginBottom: "8px" }}>راهنمای انتخاب هوشمند</div>
        <h3 style={{ fontSize: "24px", fontWeight: "800" }}>موتور پیشنهاد طعم آرُست</h3>
        <p style={{ fontSize: "14.5px", color: "var(--muted)", marginTop: "6px" }}>تنها با ۳ سوال ساده، فنجان ایده آل خود را پیدا کنید.</p>
      </div>

      {phase === "device" && (
        <div>
          <h4 style={{ fontSize: "16px", fontWeight: "700", marginBottom: "20px", textAlign: "center" }}>۱. از چه روش یا ابزاری برای دم‌آوری استفاده می‌کنید؟</h4>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "12px", justifyContent: "center" }}>
            {DEVICES.map((d) => (
              <button key={d.id} className="btn" onClick={() => handleDevice(d.id)} style={{ padding: "16px 28px", borderRadius: "var(--radius-sm)" }}>
                {d.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {phase === "taste" && (
        <div>
          <h4 style={{ fontSize: "16px", fontWeight: "700", marginBottom: "20px", textAlign: "center" }}>۲. ترجیح می‌دهید طعم قهوه شما چطور باشد؟</h4>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "16px", justifyContent: "center" }}>
            {TASTES.map((t) => (
              <button key={t.id} className="glass" onClick={() => handleTaste(t.id)} style={{ padding: "20px", textAlign: "right", color: "var(--ink)", width: "240px", cursor: "pointer", display: "flex", flexDirection: "column" }}>
                <span style={{ fontWeight: 700, fontSize: "15px", marginBottom: "6px" }}>{t.label}</span>
                <span style={{ fontSize: "12.5px", color: "var(--muted)", lineHeight: "1.6" }}>{t.desc}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {phase === "serving" && (
        <div>
          <h4 style={{ fontSize: "16px", fontWeight: "700", marginBottom: "20px", textAlign: "center" }}>۳. قهوه را چطور سرو می‌کنید؟</h4>
          <div style={{ display: "flex", gap: "16px", justifyContent: "center" }}>
            {SERVINGS.map((s) => (
              <button key={s.id} className="btn" onClick={() => handleServing(s.id)} style={{ padding: "18px 36px" }}>
                {s.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {phase === "result" && recProduct && (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
          <div style={{ marginBottom: "24px" }}>
            <Bag product={recProduct} w={120} />
          </div>
          <h4 style={{ fontSize: "15px", fontWeight: "600", color: "var(--red)", marginBottom: "4px" }}>قهوه پیشنهادی ما برای شما:</h4>
          <h3 style={{ fontSize: "28px", fontWeight: "900", color: "var(--ink)", marginBottom: "12px" }}>{recProduct.name}</h3>
          <p style={{ fontSize: "15px", color: "var(--muted)", maxWidth: "520px", lineHeight: "1.8", marginBottom: "28px" }}>
            {rec.reason}
          </p>
          <div style={{ display: "flex", gap: "12px" }}>
            <Link href={`/product/${recProduct.id}`} className="btn btn-red" style={{ display: "inline-flex" }}>
              <span>مشاهده و خرید قهوه {recProduct.name}</span>
            </Link>
            <button className="btn" onClick={reset}>
              <span>شروع دوباره</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
