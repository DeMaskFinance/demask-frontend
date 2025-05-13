import { Button } from "@/components/Buttons";
import Copy from "@/components/Common/Copy";
import FormatNumber from "@/components/Common/FormatNumber";
import MediaNFT from "@/components/Common/Media/MediaNFT";
import { EtherIcon, NoteIcon } from "@/components/Icons";
import AccountContext from "@/context/AccountContext";
import { exponentialToDecimal } from "@/libs/utils/convertExponential";
import erc1155Contract from "@/libs/utils/erc/erc1155.contract";
import Tippy from "@tippyjs/react";
import { memo, useContext, useState } from "react";
import { CgClose } from "react-icons/cg";
import { ModalTransation } from "../ModalTransation";
import Wrapper from "../Wrapper";
import divideByDecimal from "@/libs/utils/divideByDecimal";
import { queryClient } from "@/libs/constants";
import { StringParam, useQueryParam, withDefault } from "use-query-params";
import useAllowanceDML from "@/hooks/useAllowanceDML";
import handleApproveDML from "@/libs/utils/handleApproveDML";
import TokenIcon from "@/components/Logo/TokenIcon";
interface ModalConfirmAddLiquidityProps {
  isOpenConfirmAddLiquidity: boolean;
  isFetching: boolean;
  amountErcDesired: number;
  tokenAddress: Token;
  data: DataBase;
  inputNFT: string;
  nftAddress: string;
  idNFT: string;
  isOpenTransaction: boolean;
  setIsOpenTransaction: React.Dispatch<React.SetStateAction<boolean>>;
  setIsOpenConfirmAddLiquidity: React.Dispatch<React.SetStateAction<boolean>>;
  setInputNFT: React.Dispatch<React.SetStateAction<string>>;
  setInputToken: React.Dispatch<React.SetStateAction<string>>;
  setIsOpenSuccess: React.Dispatch<React.SetStateAction<boolean>>;
  setIsOpenError: React.Dispatch<React.SetStateAction<boolean>>;
  setHash: React.Dispatch<React.SetStateAction<string>>;
  setIsOpenLiquidity?: React.Dispatch<React.SetStateAction<boolean>>;
}

const ModalConfirmAddLiquidity: React.FunctionComponent<
  ModalConfirmAddLiquidityProps
> = ({
  isOpenConfirmAddLiquidity,
  tokenAddress,
  data,
  amountErcDesired,
  isFetching,
  inputNFT,
  nftAddress,
  idNFT,
  isOpenTransaction,
  setIsOpenTransaction,
  setIsOpenConfirmAddLiquidity,
  setInputNFT,
  setInputToken,
  setIsOpenLiquidity,
  setHash,
  setIsOpenSuccess,
  setIsOpenError,
}) => {
  const { demask, account, wallet, slippage, txDeadline, chainId } =
    useContext(AccountContext);
  const [isSufficientToken, setIsSufficientToken] = useState<boolean>(false);
  const [version] = useQueryParam("version", withDefault(StringParam, "v1"));
  const [loading, setLoading] = useState(false);

  const contracts = queryClient.getQueryData<ContractAddresses>([
    "contracts",
    chainId,
    version,
  ]);

  const { addERC20ERC1155 } = erc1155Contract();

  const { currentAllowance, refetch } = useAllowanceDML(
    account,
    tokenAddress?.tokenAddress,
    contracts?.ERC1155_ROUTER_ADDRESS || ""
  );
  const { approveDML } = handleApproveDML();


  const addLiquidity = async () => {
    setLoading(true);
    if (!account) {
      return;
    }

    if (
      !tokenAddress?.isNative &&
      currentAllowance <= Math.floor(amountErcDesired)
    ) {
      await approveDML(
        account,
        tokenAddress?.tokenAddress,
        String(amountErcDesired / 1e18),
        setIsOpenTransaction,
        contracts?.ERC1155_ROUTER_ADDRESS,
        refetch
      );
    }

    if (Math.floor(amountErcDesired) !== 0 && contracts) {
      try {
        setIsOpenTransaction(true);
        const result = await addERC20ERC1155(
          account,
          nftAddress,
          tokenAddress?.tokenAddress,
          idNFT,
          contracts?.ERC1155_ROUTER_ADDRESS,
          amountErcDesired,
          inputNFT,
          txDeadline,
          exponentialToDecimal(Math.floor(amountErcDesired)),
          tokenAddress?.isNative
        );
        setTimeout(() => {
          setHash(result.transactionHash);
          setIsOpenTransaction(false);
          setInputNFT("");
          setInputToken("");
          setIsOpenConfirmAddLiquidity(false);
          queryClient.refetchQueries({
            queryKey: ["useBalanceToken"],
            exact: false,
          });
          queryClient.refetchQueries({
            queryKey: ["collectionNFTBUY"],
            exact: false,
          });
          queryClient.refetchQueries({
            queryKey: ["collectionNFTSell"],
            exact: false,
          });
          queryClient.refetchQueries({
            queryKey: ["detailCollection"],
            exact: false,
          });
          queryClient.refetchQueries({
            queryKey: ["1155TradingBuy"],
            exact: false,
          });

          if (setIsOpenLiquidity) {
            setIsOpenLiquidity(false);
          }
          if (result.status === "success") {
            setIsOpenSuccess(true);
          } else {
            setIsOpenError(true);
          }

          setLoading(false);
        }, 1500);
      } catch (error) {
        setIsOpenTransaction(false);
        setIsOpenConfirmAddLiquidity(false);
        setIsOpenError(true);
        setLoading(false);
        console.error(error);
      }
    }
  };
  const handleClose = (
    e: React.MouseEvent<HTMLDivElement> | React.MouseEvent<HTMLButtonElement>
  ) => {
    e.preventDefault();
    document.body.style.overflowY = "auto";
    setIsOpenConfirmAddLiquidity(false);
  };

  return (
    <Wrapper isOpen={isOpenConfirmAddLiquidity} onClick={handleClose}>
      <div className="container_modal">
        <div className="h-fit w-[360px] md:w-[400px] lg:w-[480px] rounded-lg relative">
          <div className="px-4 pt-4">
            <div className="flex justify-between text-primary_200 border-shader_500">
              <p className="title_modal">Create Pool</p>
              <div onClick={handleClose}>
                <CgClose className="text-xl text-white transition-colors duration-100 ease-linear cursor-pointer hover:text-red" />
              </div>
            </div>
          </div>
          <div className="p-4 text-sm text-shader_200">
            <div className="flex items-center pb-4 border-b gap-x-3 border-shader_500">
              <div className="w-[65px] h-[65px] rounded-lg overflow-hidden">
                <MediaNFT data={data} isControls />
              </div>
              <div>
                <p className="text-base title">{data?.metadata?.name}</p>
                <div className="flex items-center gap-x-1">
                  <a
                    href={`${demask.urltxHash}address/${nftAddress}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {`${nftAddress.slice(0, 8)}...${nftAddress.slice(-8)}`}
                  </a>
                  <Copy content={nftAddress} />
                </div>
              </div>
            </div>
            <div className="flex flex-col py-4 gap-y-2">
              <div className="flex justify-between ">
                <p>NFT quantity</p>
                <div className="flex items-center font-bold text-white gap-x-1">
                  {inputNFT}
                  <p>
                    <TokenIcon token={tokenAddress?.symbol} w={14} h={14} />
                  </p>
                </div>
              </div>
              <div className="flex justify-between ">
                <p>Liquidity</p>
                <div className="flex gap-x-1">
                  <div className="flex items-center font-bold text-white gap-x-1">
                    <FormatNumber
                      number={divideByDecimal(amountErcDesired, "18")}
                    />

                    <TokenIcon token={tokenAddress?.symbol} w={14} h={14} />
                  </div>
                </div>
              </div>
              <div className="flex justify-between ">
                <div className="flex items-center gap-x-1">
                  <span>Slippage tolerance</span>
                  <Tippy
                    interactive
                    content={
                      <div className="flex">
                        Output is estimated. You will receive at least{" "}
                        {inputNFT} NFT or the transaction will revert
                      </div>
                    }
                  >
                    <div>
                      <NoteIcon width={14} height={14} />
                    </div>
                  </Tippy>
                </div>
                <div className="flex items-center font-bold text-primary_300 gap-x-1">
                  {slippage}%
                </div>
              </div>
              {isSufficientToken && (
                <p className="text-xs text-red" key="Tokenbalance">
                  Insufficient Token balance
                </p>
              )}
              <div className="flex justify-between p-3 mt-2 font-semibold rounded-lg bg-primary_500 bg-opacity-10">
                <p className="text-primary_200">Total MON</p>
                <div className="flex items-center font-bold text-white gap-x-1">
                  <FormatNumber
                    number={divideByDecimal(amountErcDesired, "18")}
                  />

                  <TokenIcon token={tokenAddress?.symbol} w={14} h={14} />
                </div>
              </div>
            </div>

            <div className="flex flex-col items-center">
              <Button
                disabled={isFetching || loading}
                primary={!isFetching}
                className="px-8 py-3"
                active={isFetching}
                isLoadingBtn={isFetching}
                onClick={addLiquidity}
              >
                {!tokenAddress?.isNative &&
                currentAllowance < Number(amountErcDesired)
                  ? "Approve Token"
                  : "Create Pool"}
              </Button>
            </div>
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

export default memo(ModalConfirmAddLiquidity);
