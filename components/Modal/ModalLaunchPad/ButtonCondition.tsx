import { Button } from "@/components/Buttons";
import AccountContext from "@/context/AccountContext";
import { useFetchAmountMinted, useFetchAmountSold } from "@/hooks/useFetchAmountSold";
import { checkLaunchpad } from "@/libs/utils/checkLaunchpad";
import { run } from "@/libs/validation/veryfy";
import { useRouter } from "next/router";
import React, { useContext, useEffect, useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import ModalMintLaunchPad from ".";
import InputCount from "@/components/Common/InputCount";
import { ModalSuccess } from "../ModalTransation/ModalSuccess";
import useInformationToken from "@/hooks/useInformationToken";

interface ButtonConditionProps {
  data: LaunchpadData;
  refetchAll: any;
}
const ButtonCondition: React.FC<ButtonConditionProps> = ({ data, refetchAll }) => {
  const { account, wallet, chainId } = useContext(AccountContext);
  const router = useRouter();
  const [isDisabled, setIsDisabled] = useState(true);
  const [inputAmount, setInputAmount] = useState<number>(1);
  const [error, setError] = useState("");
  const isPublic = checkLaunchpad.isPublic(data.merkleRoot);
  const [open, setOpen] = useState<boolean>(false);
  const [isOpenSuccessBuy, setIsOpenSuccessBuy] = useState<boolean>(false);
  const [hash, setHash] = useState<string>("");
  const { balanceToken } = useInformationToken(account, wallet, chainId);
  const launchpadAddress = router.query.detail ? router.query.detail[0] : "";
  const listProof = run();
  const addressOfWhitelist = listProof.find(
    (item) => item.address.toLowerCase() === account.toLowerCase()
  );



  const { data: amountSold, isLoading } = useFetchAmountSold({
    account,
    launchpadAddress,
    unit: data?.unit,
  });

  const { data: soldout } = useFetchAmountMinted({
    launchpadAddress: launchpadAddress.toString(),
    unit: Number(data?.unit)
  });



  console.log(soldout)

  const currentTime = (Date.now() / 1000) | 0;
  useEffect(() => {
    const checkConditions = async () => {
      setError("");
      setIsDisabled(true);
      const isValidTime =
        data.startTime <= currentTime && currentTime <= data.endTime;
      if (!isValidTime) {
        setError("Invalid time");
        return;
      }
      const requiredTokenAmount = inputAmount * data.price;
      if (balanceToken < requiredTokenAmount) {
        setError("Insufficient Token");
        return;
      }
      if (data.limit === data.totalSoldOut) {
        setError("Sold out");
        return;
      }

      if (data.limit === data.totalSoldOut) {
        setError("Sold out");
        return;
      }

      if (isPublic) {
        if (data.max_allocation < inputAmount + Number(soldout)) {
          setError("Max allocation");
          return;
        }
      } else {
        if (!addressOfWhitelist) {
          setError("You are not on the Whitelist");
          return;
        }

        const whitelistAmount = parseInt(addressOfWhitelist.amount, 16);
        const remainingAllocation = data.max_allocation - whitelistAmount;
        const allowedAmount = Math.min(
          whitelistAmount - Number(amountSold),
          remainingAllocation
        );
        if (inputAmount > allowedAmount) {
          setError("You do not meet the conditions to buy");
          return;
        }
      }

      setIsDisabled(false);
    };

    checkConditions();
  }, [
    inputAmount,
    balanceToken,
    data,
    isPublic,
    addressOfWhitelist,
    amountSold,
  ]);

  return (
    <>
      <InputCount
        inputAmount={inputAmount}
        setInputAmount={setInputAmount}
        isLoading={isLoading}
        isDisabled={isDisabled || inputAmount > data?.max_allocation}
        maxAlocation={data?.max_allocation}
      />
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button
            className={`w-full h-10 ${isDisabled || isLoading ? "opacity-50" : ""
              }`}
            primary
            disabled={isDisabled || isLoading}
          >
            {error || "Confirm"}
          </Button>
        </DialogTrigger>
        <DialogContent className="w-full p-4 border bg-shader_800 border-shader_500">
          <ModalMintLaunchPad
            inputAmount={inputAmount}
            refetchAll={refetchAll}
            data={data}
            isDisabled={isDisabled}
            isLoading={isLoading}
            error={error}
            setInputAmount={setInputAmount}
            setHash={setHash}
            setOpen={setOpen}
            setIsOpenSuccess={setIsOpenSuccessBuy}
          />
        </DialogContent>
      </Dialog>
      <ModalSuccess
        isOpenSuccess={isOpenSuccessBuy}
        transactionHash={hash}
        type="Buy Launchpad Success"
        setIsOpenSuccess={setIsOpenSuccessBuy}
      />
    </>
  );
};

export default ButtonCondition;
