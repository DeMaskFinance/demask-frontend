import React from "react";

import { mainnet, sepolia } from "@starknet-react/chains";
import {
  InjectedConnector,
  StarknetConfig,
  publicProvider,
  voyager,
} from "@starknet-react/core";

export function StarknetProvider({ children }: { children: React.ReactNode }) {
  const connectors = [
    new InjectedConnector({ options: { id: "argentX", name: "Argent X" } }),
    new InjectedConnector({ options: { id: "braavos", name: "Braavos" } }),
  ];
  return (
    <StarknetConfig
      chains={[mainnet, sepolia]}
      provider={publicProvider()}
      connectors={connectors}
      explorer={voyager}
    >
      {children}
    </StarknetConfig>
  );
}
