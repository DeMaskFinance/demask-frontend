import abiDML from "@/abi/abiDML.json";
import abiRouter from "@/abi/abiRouter.json";
import { Button } from "@/components/Buttons";
import FormatNumber from "@/components/Common/FormatNumber";
import AccountContext from "@/context/AccountContext";
import useAllowanceDML from "@/hooks/useAllowanceDML";
import useBananceOfDML from "@/hooks/useBalanceOfDML";
import useInformationDML from "@/hooks/useInformationDML";
import { getProvider } from "@/libs/connection/getProvider";
import { exponentialToDecimal } from "@/libs/utils/convertExponential";
import divideByDecimal from "@/libs/utils/divideByDecimal";
import handleBignumber from "@/libs/utils/handleBignumber";
import BigNumber from "bignumber.js";
import { ethers } from "ethers";
import { memo, useContext, useEffect, useState } from "react";
import { BiLoaderAlt } from "react-icons/bi";
import { CgClose } from "react-icons/cg";
import "react-toastify/dist/ReactToastify.css";
import { ModalTransation } from "../ModalTransation";
import { ModalWallet } from "../ModalWallet";
import Wrapper from "../Wrapper";
import erc1155Contract from "@/libs/utils/erc/erc1155.contract";
import ercContract721 from "@/libs/utils/erc/erc721.contract";
import { useRouter } from "next/router";
import { useQueryClient } from "@tanstack/react-query";
interface ModalConfirmRemoveLiquidityProps {
  isOpenConfirmRemoveLiquidity: boolean;
  data: DataBase;
  inputLiquidity: string;
  isOpenTransaction: boolean;
  totalSupply: string;
  routerAddress: string;
  idNFT: number[];
  setIsOpenTransaction: React.Dispatch<React.SetStateAction<boolean>>;
  setIsOpenConfirmRemoveLiquidity: React.Dispatch<
    React.SetStateAction<boolean>
  >;
  setInputLiquidity: React.Dispatch<React.SetStateAction<string>>;
  setIsOpenRemoveLiquidity: React.Dispatch<React.SetStateAction<boolean>>;
  setIsOpenSuccess: React.Dispatch<React.SetStateAction<boolean>>;
  setIsOpenError: React.Dispatch<React.SetStateAction<boolean>>;
  setHash: React.Dispatch<React.SetStateAction<string>>;
}

const ModalConfirmRemoveLiquidity: React.FunctionComponent<
  ModalConfirmRemoveLiquidityProps
> = ({
  isOpenConfirmRemoveLiquidity,
  data,
  inputLiquidity,
  isOpenTransaction,
  idNFT,
  totalSupply,
  routerAddress,
  setIsOpenTransaction,
  setIsOpenConfirmRemoveLiquidity,
  setInputLiquidity,
  setIsOpenRemoveLiquidity,
  setHash,
  setIsOpenSuccess,
  setIsOpenError,
}) => {
  const [isSufficientLiquidity, setIsSufficientLiquidity] =
    useState<boolean>(false);
  const [isApprovedLiquidity, setIsApprovedLiquidity] =
    useState<boolean>(false);
  const [amountTokenMin, setAmountTokenMin] = useState("");
  const [amountTokenDec, setAmountTokenDec] = useState("");
  const [amountNFTMin, setAmountNFTMin] = useState("");
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [preFectch, setPreFetch] = useState<boolean>(false);
  const [updatePrice, setUpdatePrice] = useState<boolean>(false);
  const { demask, tokenDefault, account, wallet, slippage } =
    useContext(AccountContext);
  const collectionAddress = useRouter().query.collection as string;
  const currentAllowance = useAllowanceDML(
    account,
    data.dmlAddress,
    wallet,
    isOpenTransaction,
    inputLiquidity,
    routerAddress
  );

  const { reserveNFT, reserveToken, isLoadingInforDML } = useInformationDML(
    data.dmlAddress,
    wallet,
    account,
    isOpenTransaction,
    false,
    false,
    false,
    isOpenConfirmRemoveLiquidity,
    updatePrice
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

  useEffect(() => {
    if (data && inputLiquidity) {
      const amountLIQUIDITY = handleBignumber(
        Number(inputLiquidity),
        Number(data.dmlDecimals)
      );
      const resAmountNFT =
        (Number(amountLIQUIDITY) * Number(reserveNFT)) / Number(totalSupply);
      const amountToken =
        (Number(amountLIQUIDITY) * Number(reserveToken)) / Number(totalSupply);
      const resAmountToken =
        (Number(amountLIQUIDITY) * Number(reserveToken)) / Number(totalSupply) +
        (((Number(amountLIQUIDITY) * Number(reserveNFT)) %
          Number(totalSupply)) *
          (Number(reserveToken) - Number(amountToken.toFixed(0)))) /
          ((Number(reserveNFT) - Math.floor(Number(resAmountNFT))) *
            Number(totalSupply));
      const resAmountTokenMinShow = divideByDecimal(
        resAmountToken.toString(),
        data.dmlDecimals
      );
      const resAmountNFTMin = Math.floor(
        Number(resAmountNFT * (1 - slippage / 100))
      );
      const resAmountTokenMin = Math.floor(
        Number(resAmountToken * (1 - slippage / 100))
      );
      setAmountNFTMin(resAmountNFTMin.toString());
      setAmountTokenMin(Math.floor(resAmountTokenMin).toString());
      setAmountTokenDec(resAmountTokenMinShow);
    }
  }, [inputLiquidity, reserveNFT, reserveToken]);

  const handleApproveDML = async () => {
    const providerChoice = await getProvider(wallet);
    const provider = new ethers.providers.Web3Provider(providerChoice);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(data.dmlAddress, abiDML, signer);
    const inputLiquidityBN = new BigNumber(inputLiquidity)
      .times(new BigNumber(10).pow(Number(data.dmlDecimals)))
      .toFixed(0);

    try {
      const result = await contract.approve(routerAddress, inputLiquidityBN);
      setIsOpenTransaction(true);
      await provider.waitForTransaction(result.hash);
      setIsOpenTransaction(false);
    } catch (error) {
      setIsOpenTransaction(false);
      console.error(error);
    }
  };
  const handleClose = (
    e: React.MouseEvent<HTMLDivElement> | React.MouseEvent<HTMLButtonElement>
  ) => {
    e.preventDefault();
    document.body.style.overflowY = "auto";
    setIsOpenConfirmRemoveLiquidity(false);
  };
  const queryClient = useQueryClient();
  const removeLiquidity = async () => {
    if (
      inputLiquidity &&
      !isSufficientLiquidity &&
      Number(amountTokenMin) > 0
    ) {
      const liquidity = handleBignumber(
        Number(inputLiquidity),
        Number(data.dmlDecimals)
      );
      try {
        setIsOpenTransaction(true);
        let result;

        if (idNFT.length > 0) {
          result = await ercContract721.removeERC20ERC721(
            wallet,
            collectionAddress,
            data.tokenAddress,
            idNFT,
            routerAddress,
            liquidity,
            amountTokenMin,
            amountNFTMin,
            account,
            slippage
          );
        } else {
          result = await erc1155Contract.removeERC20ERC1155(
            wallet,
            data.nftAddress,
            data.tokenAddress,
            data.nftID,
            routerAddress,
            liquidity,
            amountTokenMin,
            amountNFTMin,
            account,
            slippage
          );
        }
        const check = await result.wait();
        setHash(result.hash);
        setIsOpenTransaction(false);
        setInputLiquidity("");
        setIsOpenRemoveLiquidity(false);
        setIsOpenConfirmRemoveLiquidity(false);
        if (check.status === 1) {
          setIsOpenSuccess(true);
        } else {
          setIsOpenError(true);
        }
        queryClient.refetchQueries(["collectionNFTBUY"]);
        queryClient.refetchQueries(["collectionNFTSell"]);
        queryClient.refetchQueries(["detailCollection"]);
      } catch (error) {
        setIsOpenTransaction(false);
        console.error(error);
      }
    } else {
      //   setShowRequiredMessage(true);
    }
  };

  useEffect(() => {
    const load = setInterval(() => {
      if (isOpenConfirmRemoveLiquidity) {
        setPreFetch(true);
      } else {
        setPreFetch(false);
      }
    }, 20000);
    return () => {
      clearInterval(load);
    };
  }, [isOpenConfirmRemoveLiquidity, preFectch]);
  return (
    <Wrapper isOpen={isOpenConfirmRemoveLiquidity} onClick={handleClose}>
      <div className="container_modal">
        <div className="h-fit w-[360px] md:w-[400px] lg:w-[480px] rounded-lg p-4 relative">
          <p className="title_modal">You will receive</p>
          <div className="content_modal">
            {reserveToken ? (
              <p>{amountNFTMin}</p>
            ) : (
              <BiLoaderAlt className="text-3xl animate-spin text-primary_400" />
            )}
            <p>{data?.metadata?.symbol}</p>
          </div>
          <div className="flex justify-center mx-auto text-xl font-semibold text-shader_600">
            +
          </div>
          <div className="content_modal">
            <FormatNumber number={amountTokenDec} />
            <p>ETH</p>
          </div>
          {preFectch && (
            <div className="flex items-center justify-between p-4 mt-8 font-semibold text-white rounded-lg bg-primary_400">
              <p className="text-xs">Price Updated</p>
              <Button
                disabled={isLoadingInforDML}
                primary
                className="px-6 py-2 bg-primary_400"
                onClick={() => {
                  setUpdatePrice(!updatePrice);
                  setPreFetch(false);
                }}
              >
                Accept
              </Button>
            </div>
          )}
          <div className="flex justify-between mt-8 text-lg font-semibold text-primary_500">
            <p>Slippage tolerance</p>
            <p>{slippage}%</p>
          </div>
          <p className="mt-2 mb-6 text-sm text-shader_600">
            Output is estimated. You will receive at least {amountNFTMin} NFT or
            the transaction will revert
          </p>
          <div className="flex flex-col items-center mt-6">
            {!isApprovedLiquidity && account && (
              <Button
                className="w-[126px] py-2 mx-auto"
                primary
                onClick={handleApproveDML}
              >
                APPROVE
              </Button>
            )}
            {isApprovedLiquidity && (
              <Button
                disabled={isLoadingInforDML || preFectch}
                primary={!isLoadingInforDML && !preFectch}
                className="w-[144px] py-2"
                active={isLoadingInforDML || preFectch}
                onClick={removeLiquidity}
              >
                REMOVE
                {isLoadingInforDML && (
                  <BiLoaderAlt className="ml-1 text-white animate-spin" />
                )}
              </Button>
            )}
          </div>
        </div>
        <button
          className="absolute top-0 right-0 p-2 text-lg"
          onClick={handleClose}
        >
          <CgClose className="text-xl transition-colors duration-100 ease-linear hover:text-red text-white" />
        </button>
      </div>

      <ModalWallet isOpen={isOpen} setIsOpen={setIsOpen} />
      <ModalTransation
        isOpenTransation={isOpenTransaction}
        setIsOpenTransaction={setIsOpenTransaction}
        isTransaction={true}
      />
    </Wrapper>
  );
};

export default memo(ModalConfirmRemoveLiquidity);
