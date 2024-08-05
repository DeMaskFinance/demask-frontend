import { Button } from "@/components/Buttons";
import InputCount from "@/components/Common/InputCount";
import { DoneIcon, EtherIcon } from "@/components/Icons";
import ModalMintLaunchPad from "@/components/Modal/ModalLaunchPad";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
interface StageProps {
  keyProp: number;
}
interface SaleLaunchPadProps {
  data: LaunchpadData;
}
const Status = () => {
  return (
    <div className="border text-shader_200 bg-shader_400 border-shader_200 h-6 px-2 rounded-lg">
      Ended
    </div>
  );
};
const Stage: React.FC<StageProps> = ({ keyProp }) => {
  return (
    <div className="relative">
      <div className="bg-shader_500 border-shader_400 border p-3 rounded-lg flex justify-between gap-x-3 text-sm">
        <DoneIcon width={20} height={20} />
        <div className="flex-1 ">
          <p>White list {keyProp}</p>
          <p className="text-shader_200">May 25 at 12:00 GMT+7</p>
          <div className="flex gap-x-2 items-center mt-2 text-base">
            <p className="text-primary_300">10 per wallet</p>
            <p className="h-3 w-[1px] bg-shader_400"></p>
            <div className="flex gap-x-1 items-center">
              <p>0.001</p>
              <EtherIcon width={16} height={16} />
            </div>
          </div>
        </div>
        <Status />
      </div>
      {3 > keyProp && (
        <div className="absolute bottom-[-12px] w-[3px] h-3 bg-shader_400 left-6"></div>
      )}
    </div>
  );
};
const SaleLaunchPad: React.FC<SaleLaunchPadProps> = ({ data }) => {
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
              <p>50%</p>
              <p className="text-shader_200">(500/1000)</p>
            </div>
          </div>
          <div className="h-[10px] bg-primary_500 rounded-lg bg-opacity-25 w-full mt-2 mb-4 relative">
            <div className="h-[10px] bg-primary_400 rounded-lg absolute top-0 left-0 w-2/3"></div>
          </div>
        </div>
        <div className="p-3 bg-shader_500 rounded-lg">
          <p className="mb-2">Public Sale 1</p>
          <p className="text-shader_200">Price</p>
          <div className="flex gap-x-1 items-center">
            <p>0.001</p>
            <EtherIcon width={20} height={20} />
          </div>
        </div>
        <div className="flex gap-x-3 mt-4">
          <InputCount />

          <Dialog>
            <DialogTrigger asChild>
              <Button gradient className="w-full  h-10">
                Mint now
              </Button>
            </DialogTrigger>
            <DialogContent className="w-full p-4 border bg-shader_800 border-shader_500">
              <ModalMintLaunchPad inputNFT={1} />
            </DialogContent>
          </Dialog>
        </div>
      </div>
      <div className="p-4 bg_main mt-2">
        <p className="font-bold mb-4">Mint stage</p>
        <div className="flex flex-col gap-y-3">
          {Array.from({ length: 4 }).map((_, index) => (
            <Stage key={index} keyProp={index} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default SaleLaunchPad;
