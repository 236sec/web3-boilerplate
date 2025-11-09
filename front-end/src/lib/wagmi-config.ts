import { webSocket } from "viem";
import { http } from "wagmi";
import { hardhat, mainnet, sepolia } from "wagmi/chains";
import { getDefaultConfig } from "@rainbow-me/rainbowkit";

export const config = getDefaultConfig({
  appName: "My Boilerplate App",
  projectId: "91cac779a3a7a1fbc80767bd7c141f95",
  chains: [mainnet, sepolia, hardhat],
  transports: {
    [hardhat.id]: webSocket("ws://127.0.0.1:8545"),
    [mainnet.id]: http(),
    [sepolia.id]: http(),
  },
  ssr: true,
});
