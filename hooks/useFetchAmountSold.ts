import ercContract from "@/libs/utils/erc/erc.contract";
import { useQuery } from "@tanstack/react-query";

interface FetchAmountSoldParams {
  account: string;
  wallet: string;
  launchpadAddress: string;
  unit: number;
}

const fetchAmountSold = async ({
  account,
  wallet,
  launchpadAddress,
  unit,
}: FetchAmountSoldParams): Promise<number> => {
  const amountSold = await ercContract.mintedCountPerWallet(
    account,
    wallet,
    launchpadAddress,
    unit
  );
  console.log(amountSold, account);

  return amountSold;
};

export const useFetchAmountSold = ({
  account,
  wallet,
  launchpadAddress,
  unit,
}: FetchAmountSoldParams) => {
  return useQuery({
    queryKey: ["amountSold", account, wallet, launchpadAddress, unit],
    queryFn: () => fetchAmountSold({ account, wallet, launchpadAddress, unit }),
  });
};
