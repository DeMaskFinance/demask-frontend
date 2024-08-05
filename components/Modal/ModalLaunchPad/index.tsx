import { Button } from "@/components/Buttons";
import InputCount from "@/components/Common/InputCount";
import { EtherIcon } from "@/components/Icons";
import Image from "next/image";
import { useState } from "react";
import { ModalTransation } from "../ModalTransation";

interface ModalMintLaunchPadProps {
  inputNFT: number;
  data: LaunchpadData;
}

const ModalMintLaunchPad: React.FunctionComponent<ModalMintLaunchPadProps> = ({
  inputNFT,
  data,
}) => {
  const [isOpenTransation, setIsOpenTransaction] = useState(false);
  return (
    <div className="h-fit w-full md:w-[300px] lg:w-[350px] rounded-lg relative">
      <h3 className="title_modal">Confirm Mint</h3>
      <div className="flex items-center pb-4 border-b gap-x-3 border-shader_500">
        <div className="w-[52px] h-[52px] rounded-lg overflow-hidden mt-4">
          <Image
            src="/images/test.png"
            width={595}
            height={595}
            className="w-[52px] h-[52px] "
            alt="img_launchpad"
          />
        </div>
        <div>
          <p className="text-lg text-shader_200 font-bold">Toshi in lisbon</p>
          <p className="flex items-center gap-x-1 text-white font-bold">
            0.0012
            <EtherIcon width={16} height={16} />
          </p>
        </div>
      </div>
      <div className="w-full h-[1px] bg-shader_500 mb-4"></div>
      <div className="flex justify-between items-center">
        <p className="title_modal">Mint Quantity</p>
        {/* <InputCount /> */}
      </div>
      <div className="relative flex items-center justify-between w-full h-11 pl-2 mb-4 text-base font-semibold rounded-lg bg-primary_500 bg-opacity-10 mt-4">
        <div className="text-primary_100">Total Pay</div>
        <div className="flex items-center px-2 py-1 text-white gap-x-1">
          0.0123
          <EtherIcon width={16} height={16} />
        </div>
      </div>
      <Button className="w-full h-10" primary>
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
