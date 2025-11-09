"use client";

import { useMemo, useState } from "react";
import {
  useReadContract,
  useWatchContractEvent,
  useWriteContract,
} from "wagmi";
import { hardhat } from "viem/chains";

const CONTRACT_ADDRESS =
  "0x5FbDB2315678afecb367f032d93F642f64180aa3" as `0x${string}`;

const counterAbi = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "from",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "to",
        type: "uint256",
      },
    ],
    name: "Increment",
    type: "event",
  },
  {
    inputs: [],
    name: "inc",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "by",
        type: "uint256",
      },
    ],
    name: "incBy",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "x",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];

export function useCounter() {
  const [eventCounter, setEventCounter] = useState<number | null>(null);

  // Read the current counter value from the contract
  const { data } = useReadContract({
    abi: counterAbi,
    address: CONTRACT_ADDRESS,
    chainId: hardhat.id,
    functionName: "x",
  });

  // Watch for CounterChanged events
  useWatchContractEvent({
    address: CONTRACT_ADDRESS,
    chainId: hardhat.id,
    abi: counterAbi,
    eventName: "Increment",
    onLogs(logs) {
      for (const log of logs) {
        console.log("🆕 New event:", log);
        // Type assertion for the complete log with args
        const typedLog = log as typeof log & { args: { to?: bigint } };
        if (typedLog.args?.to !== undefined) {
          setEventCounter(Number(typedLog.args.to));
        }
      }
    },
  });

  // Write contract function
  const { writeContract, isPending, error } = useWriteContract();

  function incrementCounter() {
    console.log("Incrementing counter...");
    writeContract(
      {
        abi: counterAbi,
        address: CONTRACT_ADDRESS,
        chainId: hardhat.id,
        functionName: "incBy",
        args: [BigInt(1)], // Use BigInt for uint256
      },
      {
        onSuccess: (hash) => {
          console.log("✅ Transaction sent:", hash);
        },
        onError: (error) => {
          console.error("❌ Transaction failed:", error);
          console.error("Error details:", {
            message: error.message,
            cause: error.cause,
            name: error.name,
          });
        },
      }
    );
  }

  // Derive counter value from contract data or event updates
  const counter = useMemo<number | null>(() => {
    // Prefer event counter if available (more recent)
    if (eventCounter !== null) {
      return eventCounter;
    }
    // Fall back to contract read data
    if (data && typeof data === "bigint") {
      return Number(data);
    }
    return null;
  }, [data, eventCounter]);

  return {
    counter,
    incrementCounter,
    isPending,
    error,
  };
}
