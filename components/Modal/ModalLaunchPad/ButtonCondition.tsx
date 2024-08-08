import { Button } from "@/components/Buttons";
import AccountContext from "@/context/AccountContext";
import { useFetchAmountSold } from "@/hooks/useFetchAmountSold";
import { checkLaunchpad } from "@/libs/utils/checkLaunchpad";
import { run } from "@/libs/validation/veryfy";
import { useRouter } from "next/router";
import React, { useContext, useEffect, useState } from "react";
interface ButtonConditionProps {
  inputAmount: number;
  data: LaunchpadData;
  onClick: () => void;
}
const ButtonCondition: React.FC<ButtonConditionProps> = ({
  inputAmount,
  data,
  onClick,
}) => {
  const { account, wallet, balanceToken } = useContext(AccountContext);
  const router = useRouter();
  const [isDisabled, setIsDisabled] = useState(true);
  const [error, setError] = useState("");
  const isPublic = checkLaunchpad.isPublic(data.merkleRoot);
  const unit = router.query.detail ? +router.query.detail[1] : 0;
  const launchpadAddress = router.query.detail ? router.query.detail[0] : "";
  const listProof = run();
  const addressOfWhitelist = listProof.find(
    (item) => item.address.toLowerCase() === account.toLowerCase()
  );
  const { data: amountSold, isLoading } = useFetchAmountSold({
    account,
    wallet,
    launchpadAddress,
    unit,
  });
  console.log(amountSold);

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
      if (data.max_allocation === data.totalSoldOut) {
        setError("Max allocation");
        return;
      }
      if (isPublic) {
        if (data.limit < inputAmount + Number(amountSold)) {
          setError("Insufficient Limit");
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
    <Button
      className={`w-full h-10 ${isDisabled && "opacity-50"}`}
      primary
      onClick={onClick}
      disabled={isDisabled}
    >
      {error || "Confirm"}
    </Button>
  );
};

export default ButtonCondition;
