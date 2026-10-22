import React from "react";
import { Loader2 } from "lucide-react";

const Button = ({
  text = "Search",
  onClick,
  isLoading = false,
  loading = false,
  disabled = false,
  type = "button",
}) => {
  const busy = isLoading || loading;

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={busy || disabled}
      aria-busy={busy ? "true" : "false"}
      className="flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-700 px-5 py-3 text-base font-semibold text-white shadow-sm transition hover:bg-emerald-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {busy ? (
        <>
          <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
          <span>Searching...</span>
        </>
      ) : (
        text
      )}
    </button>
  );
};

export default Button;
