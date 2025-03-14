import { Button } from "@/components/Buttons";
import FormatNumber from "@/components/Common/FormatNumber";
import StatusBadge from "@/components/Common/StatusBadge";
import { DoneIcon, EtherIcon } from "@/components/Icons";
import ButtonCondition from "@/components/Modal/ModalLaunchPad/ButtonCondition";
import { ModalWallet } from "@/components/Modal/ModalWallet";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import AccountContext from "@/context/AccountContext";
import { useFetchAmountMinted } from "@/hooks/useFetchAmountSold";
import { formatTimeFns } from "@/libs/utils/formatComon";
import { useQueries } from "@tanstack/react-query";
import { useContext } from "react";
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

  if (status === "Coming Soon") {
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
            {stage.label}
          </p>

          <p className="text-shader_200">{((stage.status === "Coming Soon") ? formatTimeFns(String(stage.startTime)) : `End in: ${formatTimeFns(String(stage.endTime))}`)}</p>
          <div className="flex gap-x-2 items-center mt-2 text-base">
            <p className="text-primary_300">{stage.max_allocation} per wallet</p>
            <p className="h-3 w-[1px] bg-shader_400"></p>
            <div className="flex gap-x-1 items-center">
              <FormatNumber number={stage.price} />
              <EtherIcon width={16} height={16} />
            </div>
          </div>
          {stage.status === "Live" && (
            <div className="mt-4">
              <StatusBadge
                status={"Live"}
                startTime={stage.startTime}
                endTime={stage.endTime}
              />
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
  const getLabel = (launchpadList: any) => {
    if (!launchpadList?.data?.length) return "";

    //@ts-expect-error:error
    const liveItem = launchpadList.data.find(item => item.status === "Live");
    return liveItem ? liveItem.label : launchpadList.data[0].label;
  };



  const amountSoldList = data?.launchpadList.data?.map((item) =>
    useFetchAmountMinted({
      account,
      launchpadAddress: data?.launchpadAddress,
      unit: Number(item.unit),
    })
  );

  const isLoading = amountSoldList?.some((query) => query.isLoading);




  const refetchAll = () => {
    amountSoldList?.forEach((query) => query.refetch());
  };


  const totalMinted = amountSoldList
    .filter((query) => query.isSuccess && query.data !== undefined)
    .reduce((total, query) => total + Number(query.data), 0) || 0;


  const totalLimit = data?.launchpadList.data
    .reduce((total, query) => total + Number(query.limit), 0);

  const labelToShow = getLabel(data?.launchpadList);

  console.log(data)


  return (
    <div className="text-shader_200 basis-1/2 flex-grow-0 flex-shrink-0">
      <div className="p-4 bg_main">
        <div className="flex gap-x-2">
          <Button third>MON</Button>
          <p className="text-2xl font-bold">{data.metadata.name}</p>
        </div>
        <div className="h-[1px] w-full bg-shader_500 my-4"></div>
        {data?.isProgress &&
          <div className="relative">
            <div className="flex justify-between ">
              <p className="font-bold">Total Minted</p>
              <div className="flex items-center gap-1">
                <div className="flex items-center gap-x-1">
                  <p><span>
                    {isLoading ? data?.totalSoldOut : totalMinted}
                  </span>/{totalLimit}</p>
                </div>
                <div className="flex text-gray-400">
                  <p>({!isLoading ? ((totalMinted / totalLimit) * 100).toFixed(2) : data?.mintPercent.toFixed(2)}%)</p>
                </div>
              </div>
            </div>
            <div className="h-[10px] bg-primary_500 rounded-lg bg-opacity-25 w-full mt-2 mb-4 relative">
              <div
                className="h-[10px] bg-primary_400 rounded-lg absolute top-0 left-0 w-2/3"
                style={{
                  width: `${!isLoading ? ((totalMinted / totalLimit) * 100) : data?.mintPercent}%`,
                }}
              ></div>
            </div>
          </div>
        }
        <div className="p-3 bg-shader_500 rounded-lg">
          <p className="mb-2">
            {labelToShow}
          </p>
          <p className="text-shader_200">Price</p>
          <div className="flex gap-x-1 items-center">
            <p>{data.price}</p>
            <EtherIcon width={20} height={20} />
          </div>
        </div>
        <div className="flex gap-x-3 mt-4">
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
            <ButtonCondition data={data} refetchAll={refetchAll} />
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
