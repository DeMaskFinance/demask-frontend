interface LaunchpadInfo {
  _id: string;
  chainId: string;
  launchpadAddress: string;
  firstName: string | null;
  lastName: string | null;
  email: string | null;
  telegramID: string | null;
  website: string;
  twitter: string;
  projectName: string;
  purpose: string;
  teamDescription: string;
  pitchDeck: string | null;
  detailLaunchpad: string;
  walletAddress: string | null;
}

interface LaunchpadData {
  blockNumber: number;
  blockTime: string;
  blockTimestamp: string;
  endTime: string;
  hardcap: string;
  id: string;
  launchpad: string;
  nftAddress: string;
  nftID: string;
  price: string;
  purchaseLimit: string;
  softcap: string;
  startTime: string;
  tge: string;
  tokenDecimals: string;
  tokenName: string;
  tokenPayment: string;
  tokenSymbol: string;
  transactionHash: string;
  vesting: string;
  metadata: Metadata;
  reserveTokenDecimals: string;
  reserveToken: string;
  reserveNFT: string;
  royaltyFee: number;
  amount: string;
  totalSold: string;
  isSuccess: boolean;
  isClaim: boolean;
  status: string;
  launchpadInfo: LaunchpadInfo;
}
