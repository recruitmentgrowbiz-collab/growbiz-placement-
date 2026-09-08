"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

declare global {
  interface Window {
    Razorpay: any;
  }
}

function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (window.Razorpay) return resolve(true);
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export function RazorpayCheckoutButton({
  plan,
  planLabel,
  amountDisplay,
  isCurrent,
}: {
  plan: string;
  planLabel: string;
  amountDisplay: string;
  isCurrent: boolean;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleCheckout() {
    setError(null);
    setLoading(true);

    const scriptLoaded = await loadRazorpayScript();
    if (!scriptLoaded) {
      setError("Couldn't load the payment form. Check your connection and try again.");
      setLoading(false);
      return;
    }

    try {
      const orderRes = await fetch("/api/razorpay/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan }),
      });
      const order = await orderRes.json();
      if (!orderRes.ok) throw new Error(order.error ?? "Couldn't start checkout.");

      const razorpay = new window.Razorpay({
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: "Grow Biz Recruitment & Placement",
        description: `${planLabel} plan — monthly membership`,
        order_id: order.orderId,
        theme: { color: `rgb(${getComputedStyle(document.documentElement).getPropertyValue("--gb-magenta-action").trim()})` },
        handler: async (response: any) => {
          const verifyRes = await fetch("/api/razorpay/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              orderId: response.razorpay_order_id,
              paymentId: response.razorpay_payment_id,
              signature: response.razorpay_signature,
            }),
          });
          const result = await verifyRes.json();
          if (!verifyRes.ok) {
            setError(result.error ?? "Payment verification failed.");
            return;
          }
          router.refresh();
        },
        modal: {
          ondismiss: () => setLoading(false),
        },
      });

      razorpay.on("payment.failed", () => {
        setError("Payment failed. No charge was made — you can try again.");
        setLoading(false);
      });

      razorpay.open();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mt-6">
      <button
        onClick={handleCheckout}
        disabled={isCurrent || loading}
        className={`w-full rounded-pill px-4 py-2.5 text-[14px] font-medium ${
          isCurrent
            ? "cursor-default bg-plum-50 text-plum-700"
            : "bg-plum-600 text-white hover:bg-plum-700"
        } disabled:opacity-70`}
      >
        {isCurrent ? "Current plan" : loading ? "Opening checkout…" : `Pay ${amountDisplay} & switch`}
      </button>
      {error && <p className="mt-2 text-[12.5px] text-red-700">{error}</p>}
    </div>
  );
}
