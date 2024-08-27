import { ReactNode } from "react";

interface ChainInfo {
  name: string;
  icon: ReactNode;
}
export interface InitialValues {
  avatar: string;
  contractName: string;
  category: string[];
  symbol: string;
  chain: ChainInfo;
}
