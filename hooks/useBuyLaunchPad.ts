import { checkLaunchpad } from "@/libs/utils/checkLaunchpad";
import { useMemo } from "react";
import dataWhitelist from "@/libs/utils/data.json";

const useBuyConditions = (
  account: string,
  inputAmount: number,
  dataLaunchpad: LaunchpadData
) => {
  return useMemo(() => {
    if (checkLaunchpad.isPublic(dataLaunchpad.merkleRoot)) {
      const remainingAllocation =
        dataLaunchpad.max_allocation - dataLaunchpad.totalSoldOut;
      return inputAmount <= remainingAllocation;
    } else {
      const addressOfWhitelist = dataWhitelist.find(
        (item) => item.address === account
      );

      if (addressOfWhitelist) {
        const amount = parseInt(addressOfWhitelist.amount, 16);
        const remainingAllocation =
          dataLaunchpad.max_allocation - dataLaunchpad.totalSoldOut;
        const isEligible =
          inputAmount <= amount && inputAmount <= remainingAllocation;

        return isEligible ? addressOfWhitelist : false;
      }
    }

    return false;
  }, [account, inputAmount, dataWhitelist, dataLaunchpad]);
};

export default useBuyConditions;
