"use client";

import { useState } from "react";

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

export function CareerPlusCheckout({ isActive }: { isActive: boolean }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleCheckout() {
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/payu/initiate-career-plus", { method: "POST" });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error ?? "Couldn't start checkout.");
      submitToPayU(result.paymentUrl, result.fields);
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  }

  return (
    <div>
      <button
        onClick={handleCheckout}
        disabled={isActive || loading}
        className={`rounded-pill px-5 py-3 text-[15px] font-medium ${
          isActive ? "cursor-default bg-plum-50 text-plum-700" : "bg-plum-600 text-white hover:bg-plum-700"
        } disabled:opacity-70`}
      >
        {isActive ? "Career Plus active" : loading ? "Redirecting to payment…" : "Pay ₹1,999 & activate"}
      </button>
      {error && <p className="mt-2 text-[12.5px] text-red-700">{error}</p>}
    </div>
  );
}
