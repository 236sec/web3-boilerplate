"use client";

import { ConnectButton } from "@rainbow-me/rainbowkit";

export function MyConnectButton() {
  return (
    <ConnectButton
      label="Sign in"
      accountStatus="full"
      chainStatus="full"
      showBalance={false}
    />
  );
}
