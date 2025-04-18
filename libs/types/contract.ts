interface ContractAddresses {
  ERC1155_FACTORY_ADDRESS: string;
  ERC1155_ROUTER_ADDRESS: string;
  ERC721_FACTORY_ADDRESS: string;
  ERC721_ROUTER_ADDRESS: string;
  WETH_ADDRESS: string;
  CREATED_COLLECTION_ERC1155_CONTRACT_ADDRESS: string;
  CREATED_COLLECTION_ERC721_CONTRACT_ADDRESS: string;
  COLLECTION_DEFAULT_ERC721_CONTRACT_ADDRESS: string;
  COLLECTION_DEFAULT_ERC1155_CONTRACT_ADDRESS: string;
  MARKET_CONTRACT_ADDRESS: string;
  CREATED_COLLECTION_CLASSHASH?: string;
  APR_MON_ADDRESS: string;
}

type Token = {
  tokenAddressLowerCase: string;
  tokenAddress: string;
  decimals: number;
  name: string;
  symbol: string;
  isActive?: boolean;
  isNative?: boolean;
};
