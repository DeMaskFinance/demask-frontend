import { Button } from "@/components/Buttons";
import InputCount from "@/components/Common/InputCount";
import { MediaNFT } from "@/components/Common/Media";
import { EtherIcon } from "@/components/Icons";
import { useContext, useState } from "react";
import { ModalTransation } from "../ModalTransation";
import { checkLaunchpad } from "@/libs/utils/checkLaunchpad";
import AccountContext from "@/context/AccountContext";
import { toast } from "sonner";
import ercContract from "@/libs/utils/erc/erc.contract";
import dataWhitelist from "@/libs/utils/data.json";
import { useRouter } from "next/router";
import { queryClient } from "@/libs/constants";
import { run } from "@/libs/validation/veryfy";

interface ModalMintLaunchPadProps {
  inputAmount: number;
  data: LaunchpadData;
  setInputAmount: React.Dispatch<React.SetStateAction<number>>;
  setHash: React.Dispatch<React.SetStateAction<string>>;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setIsOpenSuccess: React.Dispatch<React.SetStateAction<boolean>>;
}
interface DataWhiteList {
  address: string;
  amount: string;
  proof?: string[];
}
const ModalMintLaunchPad: React.FunctionComponent<ModalMintLaunchPadProps> = ({
  inputAmount,
  data,
  setInputAmount,
  setHash,
  setOpen,
  setIsOpenSuccess,
}) => {
  const [isOpenTransation, setIsOpenTransaction] = useState(false);
  const router = useRouter();
  const launchpadAddress = router.query.detail ? router.query.detail[0] : "";
  const { account, wallet, balanceToken } = useContext(AccountContext);
  const unit = router.query.detail ? +router.query.detail[1] : 0;
  console.log(data);

  const handleBuyLaunchpad = async () => {
    const isPublic = checkLaunchpad.isPublic(data.merkleRoot);
    let proof: string[] = [];
    if (balanceToken < inputAmount * data.price) {
      return toast.error("Insufficient Token");
    }

    let limit = "";
    const amountSold = await ercContract.mintedCountPerWallet(
      account,
      wallet,
      launchpadAddress,
      unit
    );
    console.log(+amountSold);

    if (isPublic && data.limit < inputAmount + Number(amountSold)) {
      return toast.error("Insufficient Limit");
    }
    if (!isPublic) {
      const listProof: DataWhiteList[] = run();
      const addressOfWhitelist = listProof.find(
        (item) => item.address.toLowerCase() === account.toLowerCase()
      );

      if (!addressOfWhitelist) {
        return toast.error("You are not on the Whitelist");
      }
      const amount = parseInt(addressOfWhitelist.amount, 16);
      limit = addressOfWhitelist.amount;
      console.log(addressOfWhitelist.proof);

      const remainingAllocation = data.max_allocation - amount;
      const isEligible =
        inputAmount <= amount - Number(amountSold) &&
        inputAmount <= remainingAllocation;

      if (!isEligible) {
        return toast.error("You do not meet the conditions to buy");
      }

      proof = addressOfWhitelist.proof || [];
    }

    try {
      setIsOpenTransaction(true);

      const result = await ercContract.buyLaunchpad(
        wallet,
        proof,
        launchpadAddress,
        inputAmount,
        isPublic ? data.limit : limit,
        inputAmount * data.priceDecimals
      );

      setHash(result.hash);
      const check = await result.wait();
      if (check.status === 1) {
        setIsOpenSuccess(true);
      }
      setOpen(false);
      queryClient.refetchQueries({ queryKey: ["launchPad"] });
    } catch (error) {
      console.error(error);
      toast.error("Transaction failed. Please try again.");
    } finally {
      setIsOpenTransaction(false);
    }
  };
  return (
    <div className="h-fit w-full md:w-[300px] lg:w-[350px] rounded-lg relative">
      <h3 className="title_modal">Confirm Mint</h3>
      <div className="flex items-center pb-4 border-b gap-x-3 border-shader_500">
        <div className="w-[52px] h-[52px] rounded-lg overflow-hidden mt-4">
          <MediaNFT data={data} isControls />
        </div>
        <div>
          <p className="text-lg text-shader_200 font-bold">
            {data.metadata.name}
          </p>
          <p className="flex items-center gap-x-1 text-white font-bold">
            {data.price}
            <EtherIcon width={16} height={16} />
          </p>
        </div>
      </div>
      <div className="w-full h-[1px] bg-shader_500 mb-4"></div>
      <div className="flex justify-between items-center">
        <p className="title_modal">Mint Quantity</p>
        <InputCount inputAmount={inputAmount} setInputAmount={setInputAmount} />
      </div>
      <div className="relative flex items-center justify-between w-full h-11 pl-2 mb-4 text-base font-semibold rounded-lg bg-primary_500 bg-opacity-10 mt-4">
        <div className="text-primary_100">Total Pay</div>
        <div className="flex items-center px-2 py-1 text-white gap-x-1">
          {data.price * inputAmount}
          <EtherIcon width={16} height={16} />
        </div>
      </div>
      <Button className="w-full h-10" primary onClick={handleBuyLaunchpad}>
        Confirm
      </Button>
      <ModalTransation
        isOpenTransation={isOpenTransation}
        setIsOpenTransaction={setIsOpenTransaction}
      />
    </div>
  );
};

export default ModalMintLaunchPad;
