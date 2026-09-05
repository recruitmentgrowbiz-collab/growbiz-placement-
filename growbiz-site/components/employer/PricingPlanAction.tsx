"use client";

import { useState } from "react";
import Link from "next/link";

const planKeys: Record<string, string> = {
  Starter: "starter",
  Growth: "growth",
  Pro: "pro",
};

function submitToPayU(paymentUrl: string, fields: Record<string, string>) {
  const form = document.createElement("form");
  form.method = "POST";
  form.action = paymentUrl;
  for (const [name, value] of Object.entries(fields)) {
    const input = document.createElement("input");
    input.type = "hidden";
    input.name = name;
    input.value = value;
    form.appendChild(input);
  }
  document.body.appendChild(form);
  form.submit();
}

export function PricingPlanAction({
  planName,
  highlighted,
}: {
  planName: string;
  highlighted: boolean;
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const plan = planKeys[planName];

  const className = `mt-6 rounded-pill px-4 py-2.5 text-center text-[14px] font-medium ${
    highlighted ? "bg-plum-600 text-white hover:bg-plum-700" : "border border-plum-600 text-plum-600 hover:bg-plum-50"
  }`;

  if (planName === "Enterprise") {
    return (
      <Link href="/contact" className={className}>
        Contact Sales
      </Link>
    );
  }

  if (!plan) {
    return (
      <Link href="/employer/signup" className={className}>
        Get Started
      </Link>
    );
  }

  async function handleCheckout() {
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/payu/initiate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan }),
      });
      const result = await res.json();

      if (res.status === 401) {
        window.location.href = `/login?next=/pricing`;
        return;
      }

      if (!res.ok) {
        throw new Error(result.error ?? "Couldn't start checkout.");
      }

      submitToPayU(result.paymentUrl, result.fields);
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  }

  return (
    <div className="mt-6">
      <button onClick={handleCheckout} disabled={loading} className={`${className} w-full disabled:opacity-70`}>
        {loading ? "Redirecting..." : "Get Started"}
      </button>
      {error && <p className="mt-2 text-[12.5px] text-red-700">{error}</p>}
    </div>
  );
}
