export const getProvider = async (wallet: string) => {
  let provider = null;

  if (wallet === "bitkeep") {
    return window.starknet_bitkeep;
  }

  if (wallet === "argentX") {
    return window.starknet_argentX;
  }

  if (wallet === "braavos") {
    return window.starknet_braavos;
  }
  return provider;
};
