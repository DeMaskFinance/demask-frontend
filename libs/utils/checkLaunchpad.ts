import data from "./data.json";
export const checkLaunchpad = {
  isPublic: (merkleRoot: string) => {
    return (
      merkleRoot ===
      "0x0000000000000000000000000000000000000000000000000000000000000000"
    );
  },
  publicBuyConditions: (
    account: string,
    inputAmount: number,
    dataLaunchpad: LaunchpadData
  ) => {
    const adrressOfWhitelist = data.find((item) =>
      item.address === account ? item : false
    );
    if (adrressOfWhitelist) {
      inputAmount <= parseInt(adrressOfWhitelist.amount, 16) &&
        inputAmount <=
          dataLaunchpad.max_allocation - dataLaunchpad.totalSoldOut;
      return adrressOfWhitelist;
    }
    return false;
  },
};
