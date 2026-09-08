"use client";

import { useFormStatus } from "react-dom";

export function Field({
  label,
  name,
  type = "text",
  required = true,
  placeholder,
  defaultValue,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
  defaultValue?: string;
}) {
  return (
    <div>
      <label htmlFor={name} className="text-[13.5px] font-medium text-ink">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        defaultValue={defaultValue}
        minLength={type === "password" ? 8 : undefined}
        className="mt-1.5 min-h-11 w-full rounded-control border border-line bg-white px-3 text-[14.5px] text-ink shadow-[0_8px_18px_-16px_rgba(15,23,42,0.35)] outline-none transition focus:border-plum-500 focus:ring-2 focus:ring-plum-200"
      />
    </div>
  );
}

export function SubmitButton({ children }: { children: React.ReactNode }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="mt-2 min-h-11 rounded-pill bg-plum-600 px-5 py-3 text-[15px] font-semibold text-white shadow-[0_18px_34px_-20px_rgba(164,0,207,0.65)] transition hover:-translate-y-0.5 hover:bg-plum-700 hover:shadow-[0_24px_44px_-24px_rgba(164,0,207,0.78)] disabled:opacity-60"
    >
      {pending ? "Please wait…" : children}
    </button>
  );
}

export function FormError({ error }: { error: string | null }) {
  if (!error) return null;
  return (
    <p className="rounded-lg bg-red-50 px-3 py-2.5 text-[13.5px] text-red-700">{error}</p>
  );
}
