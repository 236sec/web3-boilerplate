"use client";

import { useCounter } from "@/hooks/contract/useCounter";
import { useMemo } from "react";
import { useAccount } from "wagmi";

export default function Counter() {
  const account = useAccount();
  const isConnected = useMemo(() => account.isConnected, [account]);

  const { counter, incrementCounter, isPending, error } = useCounter();

  return (
    <div className="max-w-xl rounded-lg border p-6 shadow-sm">
      <h2 className="text-xl font-semibold">Counter (Wagmi example)</h2>
      <p className="mt-3">
        Current value: <strong>{counter ?? "—"}</strong>
      </p>
      <div className="mt-4 flex gap-3">
        <button
          className="rounded bg-blue-600 px-4 py-2 text-white disabled:opacity-50"
          onClick={() => incrementCounter()}
          disabled={isPending || !isConnected}
        >
          {isPending ? "Sending…" : "Increase"}
        </button>
        {!isConnected && (
          <div className="text-sm text-gray-500">
            Connect a wallet to send a transaction.
          </div>
        )}
        {error && (
          <div className="text-sm text-red-500">
            Error: {error.message || "Transaction failed"}
          </div>
        )}
      </div>
    </div>
  );
}
