import { Button } from "@/components/Buttons";
import FormatNumber from "@/components/Common/FormatNumber";
import AccountContext from "@/context/AccountContext";
import useAllowanceDML from "@/hooks/useAllowanceDML";
import erc1155Contract from "@/libs/utils/erc/erc1155.contract";
import ercContract721 from "@/libs/utils/erc/erc721.contract";
import handleApproveDML from "@/libs/utils/handleApproveDML";
import handleBignumber from "@/libs/utils/handleBignumber";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { memo, useContext, useEffect, useState } from "react";
import { BiLoaderAlt } from "react-icons/bi";
import { CgClose } from "react-icons/cg";
import { ModalTransation } from "../ModalTransation";
import Wrapper from "../Wrapper";
import utilsStarknet from "@/utils/utils.starknet";
import { exponentialToDecimal } from "@/libs/utils/convertExponential";
interface ModalConfirmRemoveLiquidityProps {
  data: DataBase;
  dataTradingRemove: DataRemove;
  isOpenConfirmRemoveLiquidity: boolean;
  isFetching: boolean;
  inputLiquidity: string;
  isOpenTransaction: boolean;
  routerAddress: string;
  idNFT: number[];
  setIsOpenTransaction: React.Dispatch<React.SetStateAction<boolean>>;
  setIsOpenConfirmRemoveLiquidity: React.Dispatch<
    React.SetStateAction<boolean>
  >;
  setInputLiquidity: React.Dispatch<React.SetStateAction<string>>;
  setIsOpenSuccess: React.Dispatch<React.SetStateAction<boolean>>;
  setIsOpenError: React.Dispatch<React.SetStateAction<boolean>>;
  setHash: React.Dispatch<React.SetStateAction<string>>;
  closeModal: () => void;
}

const ModalConfirmRemoveLiquidity: React.FunctionComponent<
  ModalConfirmRemoveLiquidityProps
> = ({
  data,
  dataTradingRemove,
  isOpenConfirmRemoveLiquidity,
  isFetching,
  inputLiquidity,
  isOpenTransaction,
  idNFT,
  routerAddress,
  setIsOpenTransaction,
  setIsOpenConfirmRemoveLiquidity,
  setInputLiquidity,
  setHash,
  setIsOpenSuccess,
  setIsOpenError,
  closeModal,
}) => {
  const [isSufficientLiquidity, setIsSufficientLiquidity] =
    useState<boolean>(false);
  const [isApprovedLiquidity, setIsApprovedLiquidity] =
    useState<boolean>(false);
  const { account, wallet, slippage, providers } = useContext(AccountContext);
  const router = useRouter();
  const collectionAddress = (router.query.erc as string) || "";
  const currentAllowance = useAllowanceDML(
    account,
    data.dmlAddress,
    wallet,
    providers,
    isOpenTransaction,
    inputLiquidity,
    routerAddress
  );

  useEffect(() => {
    const checkApproveToken = async () => {
      if (
        currentAllowance &&
        Number(currentAllowance) <
          Number(
            Number(
              handleBignumber(Number(inputLiquidity), Number(data.dmlDecimals))
            ).toFixed(0)
          )
      ) {
        setIsApprovedLiquidity(false);
      } else {
        setIsApprovedLiquidity(true);
      }
    };
    checkApproveToken();
  }, [account, wallet, inputLiquidity, currentAllowance, isOpenTransaction]);

  const queryClient = useQueryClient();
  const removeLiquidity = async () => {
    if (
      inputLiquidity &&
      !isSufficientLiquidity &&
      Number(dataTradingRemove.amountETHDecimals) > 0
    ) {
      const liquidity = handleBignumber(
        Number(inputLiquidity),
        Number(data.dmlDecimals)
      );
      try {
        setIsOpenTransaction(true);
        let result;

        result = await utilsStarknet.removeLiquidity({
          contractAddress: routerAddress,
          token: data.tokenAddress,
          nft: collectionAddress,
          tokenId: idNFT,
          liquidity: liquidity,
          amountTokenMin: 0,
          amountNftMin: 0,

          to: account,
          deadline: Math.floor(
            (new Date().getTime() + slippage * 60000) / 1000
          ),
        });

        setHash(result?.transaction_hash as string);

        setIsOpenTransaction(false);
        setInputLiquidity("");
        closeModal();
        setIsOpenConfirmRemoveLiquidity(false);
        if (result?.statusReceipt === "success") {
          setIsOpenSuccess(true);
        } else {
          setIsOpenError(false);
        }
        queryClient.refetchQueries({ queryKey: ["collectionNFTBUY"] });
        queryClient.refetchQueries({ queryKey: ["collectionNFTSell"] });
        queryClient.refetchQueries({ queryKey: ["detailCollection"] });
      } catch (error) {
        setIsOpenTransaction(false);
        console.error(error);
      }
    }
  };

  const handleClose = (
    e: React.MouseEvent<HTMLDivElement> | React.MouseEvent<HTMLButtonElement>
  ) => {
    e.preventDefault();
    document.body.style.overflowY = "auto";
    setIsOpenConfirmRemoveLiquidity(false);
  };
  return (
    <Wrapper isOpen={isOpenConfirmRemoveLiquidity} onClick={handleClose}>
      <div className="container_modal">
        <div className="h-fit w-[360px] md:w-[400px] lg:w-[480px] rounded-lg p-4 relative">
          <div className="flex justify-between title_modal">
            <p className="title_modal">You will receive</p>

            <button className="text-lg " onClick={handleClose}>
              <CgClose className="text-xl text-white transition-colors duration-100 ease-linear cursor-pointer hover:text-red" />
            </button>
          </div>
          <div className="content_modal">
            <FormatNumber number={dataTradingRemove.amountNFT} />
            <p>{data?.metadata?.symbol}</p>
          </div>
          <div className="flex justify-center mx-auto text-xl font-semibold text-shader_100">
            +
          </div>
          <div className="content_modal">
            <FormatNumber number={dataTradingRemove.amountETH} />
            <p>ETH</p>
          </div>

          <div className="flex justify-between mt-8 text-lg font-semibold text-primary_500">
            <p>Slippage tolerance</p>
            <p>{slippage}%</p>
          </div>
          <p className="mt-2 mb-6 text-sm text-shader_200">
            Output is estimated. You will receive at least{" "}
            {dataTradingRemove.amountNFT} NFT or the transaction will revert
          </p>
          <div className="flex flex-col items-center mt-6">
            {isApprovedLiquidity ? (
              <Button
                disabled={isFetching}
                primary={!isFetching}
                className="w-[144px] py-2"
                active={isFetching}
                onClick={removeLiquidity}
              >
                REMOVE
                {isFetching && (
                  <BiLoaderAlt className="ml-1 text-white animate-spin" />
                )}
              </Button>
            ) : (
              <Button
                className="w-[126px] py-2 mx-auto"
                primary
                onClick={() => {
                  handleApproveDML(
                    account,
                    wallet,
                    data.dmlAddress,
                    inputLiquidity,
                    setIsOpenTransaction,
                    routerAddress
                  );
                }}
              >
                Approve
              </Button>
            )}
          </div>
        </div>
      </div>

      <ModalTransation
        isOpenTransation={isOpenTransaction}
        setIsOpenTransaction={setIsOpenTransaction}
      />
    </Wrapper>
  );
};

export default memo(ModalConfirmRemoveLiquidity);
