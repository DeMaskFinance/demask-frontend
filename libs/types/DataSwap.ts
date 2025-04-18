interface DataBase {
  dmlAddress: string;
  tokenSymbol: string;
  tokenDecimals: string;
  uri: string;
  metadata: Metadata;
  reserveTokenDecimals: string;
  reserveToken: string;
  reserveNFT: string;
  royaltyFee: number;
  dmlList?: any;
  nftAddress: string;
  nftID: string;
  tokenAddress: string;
  dmlDecimals: string;
  isDeleted: boolean;
  name?: string;
  avatar?: string;
  collectionName: string;
  symbol?: string;
  balanceDml?: number;
  totalSupplyDml?: number;
  paymentToken?: Token;
}
interface BaseDataTrade {
  reserveToken: number;
  reserveNFT: number;
  amount: number;
  fees: number[];
  totalFee: number;
  price: number;
}

interface DataBuy extends BaseDataTrade {
  maxAmount: number;
  maxAmountDecimals: number;
  totalPay: number;
  paymentToken: Token;
}

interface DataSell extends BaseDataTrade {
  minAmount: number;
  minAmountDecimals: number;
  totalReceipts: number;
  paymentToken: Token;
}
interface DataAdd extends BaseDataTrade {
  amountETH: number;
  amountETHDecimals: number;
}
interface DataRemove extends DataAdd {
  balanceDml: number;
  balanceDmlDecimals: number;
  totalSupplyDml: number;
  totalSupplyDmlDecimals: number;
  amountNFT: number;
  maxNft: number;
}
