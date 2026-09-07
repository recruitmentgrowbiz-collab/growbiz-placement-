"use client";

import { useState, useTransition } from "react";
import { changePlan } from "@/lib/supabase/employer-actions";
import { PayUCheckoutButton } from "./PayUCheckout";

const planKeys: Record<string, string> = {
  Free: "free",
  Starter: "starter",
  Growth: "growth",
  Pro: "pro",
};

export function PlanSwitcher({
  currentPlan,
  planName,
  price,
}: {
  currentPlan: string;
  planName: string;
  price: string;
}) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const key = planKeys[planName];

  if (!key) {
    return (
      <a
        href="/contact"
        className="mt-6 block rounded-pill border border-plum-600 px-4 py-2.5 text-center text-[14px] font-medium text-plum-600 hover:bg-plum-50"
      >
        Contact Sales
      </a>
    );
  }

  const isCurrent = currentPlan === key;

  // Free plan has nothing to charge — switch entitlements directly.
  if (key === "free") {
    return (
      <div className="mt-6">
        <button
          disabled={isCurrent || isPending}
          onClick={() =>
            startTransition(async () => {
              setError(null);
              const result = await changePlan(key);
              if (result.error) setError(result.error);
            })
          }
          className={`w-full rounded-pill px-4 py-2.5 text-[14px] font-medium ${
            isCurrent
              ? "cursor-default bg-plum-50 text-plum-700"
              : "border border-plum-600 text-plum-600 hover:bg-plum-50"
          } disabled:opacity-70`}
        >
          {isCurrent ? "Current plan" : isPending ? "Switching…" : "Switch to Free"}
        </button>
        {error && <p className="mt-2 text-[12.5px] text-red-700">{error}</p>}
      </div>
    );
  }

  return (
    <PayUCheckoutButton plan={key} planLabel={planName} amountDisplay={price} isCurrent={isCurrent} />
  );
}
