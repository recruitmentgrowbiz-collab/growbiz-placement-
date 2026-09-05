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

export function PayUCheckoutButton({
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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
      if (!res.ok) throw new Error(result.error ?? "Couldn't start checkout.");

      // Redirect-based flow, not a JS popup — the browser navigates away to
      // PayU's hosted payment page and comes back via the success/failure
      // callback routes once payment completes.
      submitToPayU(result.paymentUrl, result.fields);
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  }

  return (
    <div className="mt-6">
      <button
        onClick={handleCheckout}
        disabled={isCurrent || loading}
        className={`w-full rounded-pill px-4 py-2.5 text-[14px] font-medium ${
          isCurrent ? "cursor-default bg-plum-50 text-plum-700" : "bg-plum-600 text-white hover:bg-plum-700"
        } disabled:opacity-70`}
      >
        {isCurrent ? "Current plan" : loading ? "Redirecting to payment…" : `Upgrade to ${planLabel} — ${amountDisplay}`}
      </button>
      {error && <p className="mt-2 text-[12.5px] text-red-700">{error}</p>}
    </div>
  );
}
