import { Button } from "@/components/Buttons";
import InputCount from "@/components/Common/InputCount";
import { MediaNFT } from "@/components/Common/Media";
import { EtherIcon } from "@/components/Icons";
import AccountContext from "@/context/AccountContext";
import { queryClient } from "@/libs/constants";
import { checkLaunchpad } from "@/libs/utils/checkLaunchpad";
import ercContract from "@/libs/utils/erc/erc.contract";
import { run } from "@/libs/validation/veryfy";
import { useRouter } from "next/router";
import { useContext, useState } from "react";
import { toast } from "sonner";
import { ModalTransation } from "../ModalTransation";

interface ModalMintLaunchPadProps {
  inputAmount: number;
  data: LaunchpadData;
  isDisabled: boolean;
  isLoading: boolean;
  error: string;
  setInputAmount: React.Dispatch<React.SetStateAction<number>>;
  setHash: React.Dispatch<React.SetStateAction<string>>;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setIsOpenSuccess: React.Dispatch<React.SetStateAction<boolean>>;
}

const ModalMintLaunchPad: React.FunctionComponent<ModalMintLaunchPadProps> = ({
  inputAmount,
  data,
  isDisabled,
  isLoading,
  error,
  setInputAmount,
  setHash,
  setOpen,
  setIsOpenSuccess,
}) => {
  const [isOpenTransation, setIsOpenTransaction] = useState(false);
  const router = useRouter();
  const launchpadAddress = router.query.detail ? router.query.detail[0] : "";
  const { account, wallet } = useContext(AccountContext);
  const isPublic = checkLaunchpad.isPublic(data.merkleRoot);
  const listProof = run();
  const addressOfWhitelist = listProof.find(
    (item) => item.address.toLowerCase() === account.toLowerCase()
  );
  const { buyLaunchpad } = ercContract();

  const handleBuyLaunchpad = async () => {
    let limit = "";
    let proof: string[] = [];

    if (!isPublic && addressOfWhitelist) {
      proof = addressOfWhitelist.proof || [];
      limit = addressOfWhitelist.amount;
    }



    try {
      setIsOpenTransaction(true);
      const result = await buyLaunchpad(
        proof,
        launchpadAddress,
        inputAmount,
        isPublic ? data.limit : limit,
        inputAmount * data.priceDecimals
      );

      setHash(result.transactionHash);
      if (result.status === "success") {
        setIsOpenSuccess(true);
      }
      setOpen(false);
      queryClient.refetchQueries({ queryKey: ["launchPad"] });
      queryClient.refetchQueries({ queryKey: ["amountSold"] });
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
        <InputCount
          inputAmount={inputAmount}
          setInputAmount={setInputAmount}
          isDisabled={isDisabled}
          isLoading={isLoading}
          maxAlocation={data?.max_allocation}
        />
      </div>
      <div className="relative flex items-center justify-between w-full h-11 pl-2 mb-4 text-base font-semibold rounded-lg bg-primary_500 bg-opacity-10 mt-4">
        <div className="text-primary_100">Total Pay</div>
        <div className="flex items-center px-2 py-1 text-white gap-x-1">
          {data.price * inputAmount}
          <EtherIcon width={16} height={16} />
        </div>
      </div>
      <Button
        className={`w-full h-10 ${isDisabled || isLoading ? "opacity-50" : ""}`}
        primary
        disabled={isDisabled || isLoading}
        onClick={handleBuyLaunchpad}
      >
        {error || "Confirm"}
      </Button>
      <ModalTransation
        isOpenTransation={isOpenTransation}
        setIsOpenTransaction={setIsOpenTransaction}
      />
    </div>
  );
};

export default ModalMintLaunchPad;
