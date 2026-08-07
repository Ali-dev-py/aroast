"use client";

import React from "react";
import Link from "next/link";
import { useAppState } from "./AppState";
import { Price, Bag, IconX, IconArrow, IconGift, IconTruck, IconShield } from "./UI";
import { faNum } from "../lib/aroast";
import { useProducts } from "../lib/api";

export function CartDrawer({ open, onClose }) {
  const { cart, setQty, removeItem, firstOrder } = useAppState();
  const { products } = useProducts();

  if (!open) return null;

  const totalQty = cart.reduce((s, it) => s + it.qty, 0);
  const rawSubtotal = cart.reduce((s, it) => s + (it.price * it.qty), 0);
  const totalWeight = cart.reduce((s, it) => s + (it.grams * it.qty), 0);

  // delivery rules (PRD §4)
  const freeShip = totalWeight >= 500;
  const deliveryFee = freeShip ? 0 : 200000;
  const grandTotal = rawSubtotal + deliveryFee;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 100,
        display: "flex",
        justifyContent: "flex-end",
        background: "rgba(8,7,10,0.6)",
        backdropFilter: "blur(6px)",
        direction: "rtl",
      }}
    >
      {/* Backdrop closer */}
      <div style={{ flex: 1 }} onClick={onClose} />

      {/* Panel container */}
      <div
        className="glass"
        style={{
          width: "100%",
          maxWidth: 440,
          height: "100%",
          borderRadius: 0,
          borderRight: "1px solid rgba(255,255,255,0.08)",
          background: "rgba(12,11,15,0.98)",
          display: "flex",
          flexDirection: "column",
          boxShadow: "-10px 0 40px rgba(0,0,0,0.5)",
        }}
      >
        {/* Drawer Head */}
        <div style={{ padding: "24px 20px", borderBottom: "1px solid var(--line)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <h3 style={{ fontSize: 20, fontWeight: 800 }}>سبد خرید شما</h3>
            <div style={{ fontSize: 13, color: "var(--muted)", marginTop: 2 }}>
              {faNum(totalQty)} آیتم • {faNum(totalWeight)} گرم قهوه تازه
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: "rgba(255,255,255,0.03)",
              border: "1px solid var(--line)",
              borderRadius: "50%",
              width: 38,
              height: 38,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "var(--ink)",
              cursor: "pointer",
            }}
          >
            <IconX size={16} />
          </button>
        </div>

        {/* Drawer Body (Scrollable items) */}
        <div style={{ flex: 1, overflowY: "auto", padding: "20px" }} className="r-ph-20">
          {cart.length === 0 ? (
            <div style={{ height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16 }}>
              <Bag product={null} w={60} sticker="black" />
              <div style={{ textAlign: "center" }}>
                <div style={{ fontWeight: 700, fontSize: 16 }}>سبد خرید خالی است</div>
                <div style={{ color: "var(--muted)", fontSize: 13, marginTop: 4 }}>قهوه تازه هفتگی خود را انتخاب کنید.</div>
              </div>
              <button onClick={() => { onClose(); }} className="btn btn-red" style={{ marginTop: 8 }}>
                مشاهده فروشگاه قهوه
              </button>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {/* First-Order Gift Strip */}
              {firstOrder && (
                <div
                  className="glass-flat"
                  style={{
                    padding: "12px 14px",
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    border: "1px solid rgba(216,38,44,0.25)",
                    background: "rgba(216,38,44,0.04)",
                  }}
                >
                  <div style={{ color: "var(--red)" }}>
                    <IconGift size={20} />
                  </div>
                  <div style={{ fontSize: 13, lineHeight: 1.6 }}>
                    <strong style={{ color: "var(--ink)" }}>هدیه سفارش اول!</strong> یک بسته ۵۰ گرمی قهوه <strong style={{ color: "var(--red)" }}>بیداری</strong> مهمان برشته‌کاری ما هستید (به سفارش شما اضافه خواهد شد).
                  </div>
                </div>
              )}

              {/* Items List */}
              {cart.map((it) => {
                const prod = products.find((p) => p.id === it.id);
                return (
                  <div
                    key={it.key}
                    className="glass-flat"
                    style={{
                      padding: 14,
                      display: "flex",
                      gap: 14,
                      alignItems: "center",
                      position: "relative",
                    }}
                  >
                    <Bag product={prod} w={48} sticker={it.box ? "black" : "auto"} weightLabel={it.grams >= 1000 ? "1KG" : `${it.grams}G`} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                        <h4 style={{ fontSize: 14.5, fontWeight: 700, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{it.name}</h4>
                        <button
                          onClick={() => removeItem(it.key)}
                          style={{
                            background: "none",
                            border: "none",
                            color: "var(--faint)",
                            cursor: "pointer",
                            padding: 2,
                          }}
                        >
                          <IconX size={14} />
                        </button>
                      </div>
                      <div style={{ fontSize: 12.5, color: "var(--muted)", marginTop: 3 }}>
                        {it.sizeLabel} • {it.grind}
                        {it.cadence && <span style={{ color: "var(--red)" }}> • {it.cadence}</span>}
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 12 }}>
                        {/* Quantity controls */}
                        <div style={{ display: "flex", alignItems: "center", gap: 10, border: "1px solid var(--line)", borderRadius: 999, padding: "2px 8px" }}>
                          <button
                            onClick={() => it.qty > 1 && setQty(it.key, it.qty - 1)}
                            disabled={it.qty <= 1}
                            style={{ background: "none", border: "none", color: "var(--muted)", cursor: "pointer", fontSize: 16 }}
                          >
                            -
                          </button>
                          <span style={{ fontFamily: "var(--mono)", fontSize: 13, fontWeight: "bold" }}>{faNum(it.qty)}</span>
                          <button
                            onClick={() => setQty(it.key, Math.min(9, it.qty + 1))}
                            disabled={it.qty >= 9}
                            style={{ background: "none", border: "none", color: "var(--muted)", cursor: "pointer", fontSize: 14 }}
                          >
                            +
                          </button>
                        </div>
                        <Price value={it.price * it.qty} size={14} />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Drawer Footer (Checkout Summary) */}
        {cart.length > 0 && (
          <div style={{ padding: "20px", borderTop: "1px solid var(--line)", background: "rgba(8,7,10,0.6)" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 20 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: 14, color: "var(--muted)" }}>مجموع سفارش</span>
                <Price value={rawSubtotal} size={14.5} />
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: 14, color: "var(--muted)", display: "inline-flex", alignItems: "center", gap: 6 }}>
                  <IconTruck size={15} /> هزینه ارسال (پیک تهران)
                </span>
                {freeShip ? (
                  <span style={{ fontSize: 13, color: "var(--red)", fontWeight: "bold" }}>رایگان (رُست بالای ۵۰۰ گرم)</span>
                ) : (
                  <Price value={200000} size={14} />
                )}
              </div>
              {!freeShip && (
                <div style={{ fontSize: 12, color: "var(--red)", marginTop: -4, textAlign: "right" }}>
                  {faNum(500 - totalWeight)} گرم دیگر اضافه کنید تا ارسال شما رایگان شود!
                </div>
              )}
              <div style={{ borderTop: "1px solid var(--line)", paddingTop: 12, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: 16, fontWeight: "bold" }}>مجموع کل نهایی</span>
                <Price value={grandTotal} size={18} red />
              </div>
            </div>

            <Link href="/checkout" onClick={onClose} className="btn btn-red btn-block btn-lg" style={{ gap: 12, display: "inline-flex" }}>
              <span>ورود به مرحله تسویه حساب</span>
              <IconArrow size={18} />
            </Link>

            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 6, color: "var(--faint)", fontSize: 11.5, marginTop: 14 }}>
              <IconShield size={14} /> پرداخت امن بانکی با کلیه کارت‌های عضو شتاب
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
