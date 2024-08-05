import { Button } from "@/components/Buttons";
import FormatNumber from "@/components/Common/FormatNumber";
import InputCount from "@/components/Common/InputCount";
import StatusBadge from "@/components/Common/StatusBadge";
import { DoneIcon, EtherIcon } from "@/components/Icons";
import ModalMintLaunchPad from "@/components/Modal/ModalLaunchPad";
import { ModalWallet } from "@/components/Modal/ModalWallet";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import AccountContext from "@/context/AccountContext";
import useBuyConditions from "@/hooks/useBuyLaunchPad";
import { checkLaunchpad } from "@/libs/utils/checkLaunchpad";
import { formatTimestamp } from "@/libs/utils/formatComon";
import { useContext, useMemo, useState } from "react";

interface StageProps {
  stage: LaunchpadItem;
  countStage: number;
}
interface SaleLaunchPadProps {
  data: LaunchpadData;
}
interface StatusProps {
  status: StatusType;
}

const Status: React.FC<StatusProps> = ({ status }) => {
  if (status === "Ended") {
    return (
      <div className="border text-shader_200 bg-shader_400 border-shader_200 h-6 px-2 rounded-full font-semibold">
        Ended
      </div>
    );
  }

  if (status === "Upcoming") {
    return (
      <div className="border text-primary_300 bg-primary_500 border-primary_500 h-6 px-2 rounded-full bg-opacity-15 font-semibold">
        Upcoming
      </div>
    );
  }

  return null;
};
const Stage: React.FC<StageProps> = ({ stage, countStage }) => {
  return (
    <div className="relative">
      <div className="bg-shader_500 border-shader_400 border p-3 rounded-lg flex justify-between gap-x-3 text-sm">
        {stage.status === "Ended" ? (
          <DoneIcon width={20} height={20} />
        ) : stage.status === "Live" ? (
          <div className="w-5 h-5 border-2 border-green rounded-full"></div>
        ) : (
          <div className="w-5 h-5 bg-shader_400 rounded-full"></div>
        )}

        <div className="flex-1 ">
          <p>
            {checkLaunchpad.isPublic(stage.merkleRoot)
              ? "Public Sale"
              : "White list"}{" "}
            {stage.unit}
          </p>
          <p className="text-shader_200">{formatTimestamp(stage.endTime)}</p>
          <div className="flex gap-x-2 items-center mt-2 text-base">
            <p className="text-primary_300">{stage.limit} per wallet</p>
            <p className="h-3 w-[1px] bg-shader_400"></p>
            <div className="flex gap-x-1 items-center">
              <FormatNumber number={stage.price} />
              <EtherIcon width={16} height={16} />
            </div>
          </div>
          {stage.status === "Live" && (
            <div className="mt-4">
              <StatusBadge status={"Live"} />
            </div>
          )}
        </div>
        <Status status={stage.status as StatusType} />
      </div>
      {countStage - 1 > stage.unit && (
        <div className="absolute bottom-[-12px] w-[3px] h-3 bg-shader_400 left-6"></div>
      )}
    </div>
  );
};
const SaleLaunchPad: React.FC<SaleLaunchPadProps> = ({ data }) => {
  const { account } = useContext(AccountContext);
  const currentTime = (Date.now() / 1000) | 0;
  const isValidTime =
    data.startTime <= currentTime && currentTime <= data.endTime;
  const [inputAmount, setInputAmount] = useState<number>(1);
  const [open, setOpen] = useState<boolean>(false);
  const isValidBuy = useBuyConditions(account, inputAmount, data);
  console.log(isValidBuy);

  console.log(
    data,
    checkLaunchpad.publicBuyConditions(
      "0x4F91a27324Bf6298F855819960F19e2CC1627724",
      1,
      data
    )
  );

  return (
    <div className="text-shader_200 basis-1/2 flex-grow-0 flex-shrink-0">
      <div className="p-4 bg_main">
        <div className="flex gap-x-2">
          <Button third>ETH</Button>
          <p className="text-2xl font-bold">{data.metadata.name}</p>
        </div>
        <div className="h-[1px] w-full bg-shader_500 my-4"></div>
        <div className="relative">
          <div className="flex justify-between ">
            <p className="font-bold">Total Minted</p>
            <div className="flex gap-x-1 ">
              <p>{data.mintPercent}%</p>
              <p className="text-shader_200">
                ({data.totalSoldOut}/{data.max_allocation})
              </p>
            </div>
          </div>
          <div className="h-[10px] bg-primary_500 rounded-lg bg-opacity-25 w-full mt-2 mb-4 relative">
            <div
              className="h-[10px] bg-primary_400 rounded-lg absolute top-0 left-0 w-2/3"
              style={{
                width: `${(data.totalSoldOut / data.max_allocation) * 100}%`,
              }}
            ></div>
          </div>
        </div>
        <div className="p-3 bg-shader_500 rounded-lg">
          <p className="mb-2">
            {checkLaunchpad.isPublic(data.merkleRoot)
              ? "Public Sale"
              : "White list"}{" "}
            {data.unit}
          </p>
          <p className="text-shader_200">Price</p>
          <div className="flex gap-x-1 items-center">
            <p>{inputAmount ? data.price * inputAmount : data.price}</p>
            <EtherIcon width={20} height={20} />
          </div>
        </div>
        <div className="flex gap-x-3 mt-4">
          <InputCount
            inputAmount={inputAmount}
            setInputAmount={setInputAmount}
          />
          {!account ? (
            <Dialog>
              <DialogTrigger asChild>
                <Button className="w-full h-10 py-4" primary>
                  Connect Wallet
                </Button>
              </DialogTrigger>
              <DialogContent className="w-full  p-0 border-none">
                <ModalWallet />
              </DialogContent>
            </Dialog>
          ) : (
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button
                  disabled={!isValidTime}
                  gradient
                  className={`w-full h-10 ${!isValidTime && "opacity-60"}`}
                >
                  Mint now
                </Button>
              </DialogTrigger>
              <DialogContent className="w-full p-4 border bg-shader_800 border-shader_500">
                <ModalMintLaunchPad inputNFT={1} data={data} />
              </DialogContent>
            </Dialog>
          )}
        </div>
      </div>
      <div className="p-4 bg_main mt-2">
        <p className="font-bold mb-4">Mint stage</p>
        <div className="flex flex-col gap-y-3">
          {data.launchpadList.data.map((item, index) => (
            <Stage
              key={index}
              stage={item}
              countStage={data.launchpadList.data.length}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default SaleLaunchPad;
