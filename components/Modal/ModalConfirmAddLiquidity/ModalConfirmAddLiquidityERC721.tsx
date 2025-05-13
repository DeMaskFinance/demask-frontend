import { Button } from "@/components/Buttons";
import Copy from "@/components/Common/Copy";
import FormatNumber from "@/components/Common/FormatNumber";
import { MediaCollection } from "@/components/Common/Media";
import { EtherIcon, NoteIcon } from "@/components/Icons";
import AccountContext from "@/context/AccountContext";
import useAllowanceDML from "@/hooks/useAllowanceDML";
import useInformationToken from "@/hooks/useInformationToken";
import { queryClient } from "@/libs/constants";
import { exponentialToDecimal } from "@/libs/utils/convertExponential";
import erc721Contract from "@/libs/utils/erc/erc721.contract";
import { formatLinkIPFS } from "@/libs/utils/formatComon";
import Tippy from "@tippyjs/react";
import { useRouter } from "next/router";
import { memo, useContext, useEffect, useState } from "react";
import { BiLoaderAlt } from "react-icons/bi";
import { StringParam, useQueryParam, withDefault } from "use-query-params";
import { ModalTransation } from "../ModalTransation";
import TokenIcon from "@/components/Logo/TokenIcon";
import handleApproveDML from "@/libs/utils/handleApproveDML";
interface ModalConfirmAddLiquidityERC721Props {
  data: any;
  dataTradingAdd: DataAdd;
  isOpenTransaction: boolean;
  tokenAddress?: Token;
  inputNFT: number[];
  isFetching: boolean;
  setIsOpenTransaction: React.Dispatch<React.SetStateAction<boolean>>;
  setIsOpenAddLiquidity: React.Dispatch<React.SetStateAction<boolean>>;
  setIsOpenConfirmAddLiquidity: React.Dispatch<React.SetStateAction<boolean>>;
  setIdNFT: React.Dispatch<React.SetStateAction<number[]>>;
  setInputToken: React.Dispatch<React.SetStateAction<string>>;
  setIsOpenSuccess: React.Dispatch<React.SetStateAction<boolean>>;
  setIsOpenError: React.Dispatch<React.SetStateAction<boolean>>;
  setHash: React.Dispatch<React.SetStateAction<string>>;
  inputToken: any;
}

const ModalConfirmAddLiquidityERC721: React.FunctionComponent<
  ModalConfirmAddLiquidityERC721Props
> = ({
  data,
  dataTradingAdd,
  inputToken,
  isOpenTransaction,
  tokenAddress,
  inputNFT,
  isFetching,
  setIsOpenTransaction,
  setIdNFT,
  setInputToken,
  setHash,
  setIsOpenSuccess,
  setIsOpenError,
  setIsOpenAddLiquidity,
  setIsOpenConfirmAddLiquidity,
}) => {
  const { demask, account, wallet, slippage, txDeadline, chainId } =
    useContext(AccountContext);
  const [isSufficientToken, setIsSufficientToken] = useState<boolean>(false);
  const [version] = useQueryParam("version", withDefault(StringParam, "v1"));
  const contracts = queryClient.getQueryData<ContractAddresses>([
    "contracts",
    chainId,
    version,
  ]);
  const { bigNumberBalance } = useInformationToken(account, wallet, chainId);
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const slug = (router.query.slug as string[]) || [];

  const collectionAddress = slug[0] || "";

  useEffect(() => {
    if (Number(dataTradingAdd.amountETHDecimals) > Number(bigNumberBalance)) {
      setIsSufficientToken(true);
    } else {
      setIsSufficientToken(false);
    }
  }, [bigNumberBalance, dataTradingAdd]);

  const { addLiquidity } = erc721Contract();

  const { currentAllowance, refetch } = useAllowanceDML(
    account,
    tokenAddress?.tokenAddress,
    contracts?.ERC721_ROUTER_ADDRESS || ""
  );

  const { approveDML } = handleApproveDML();

  const handleAddLiquidity = async () => {
    try {
      setLoading(true);
      setIsOpenTransaction(true);

      if (
        !tokenAddress?.isNative &&
        currentAllowance <=
          (dataTradingAdd.amountETHDecimals
            ? Number(dataTradingAdd.amountETHDecimals)
            : Number(inputToken) * 1e18)
      ) {
        await approveDML(
          account,
          tokenAddress?.tokenAddress,
          String(
            dataTradingAdd.amountETHDecimals
              ? dataTradingAdd.amountETHDecimals
              : Number(inputToken)
          ),
          setIsOpenTransaction,
          contracts?.ERC721_ROUTER_ADDRESS,
          refetch
        );
      }

      if (Math.floor(dataTradingAdd.amountETHDecimals) !== 0 && contracts) {
        const result = await addLiquidity(
          collectionAddress,
          tokenAddress?.tokenAddress,
          inputNFT,
          contracts.ERC721_ROUTER_ADDRESS,
          dataTradingAdd.amountETHDecimals
            ? dataTradingAdd.amountETHDecimals
            : Number(inputToken) * 1e18,
          account,
          txDeadline,
          exponentialToDecimal(
            Math.floor(
              dataTradingAdd.amountETHDecimals || Number(inputToken) * 1e18
            )
          ),
          tokenAddress?.isNative
        );

        setTimeout(() => {
          setHash(result.transactionHash);
          setInputToken("");
          setIdNFT([]);
          setIsOpenConfirmAddLiquidity(false);
          setIsOpenAddLiquidity(false);
          setIsOpenTransaction(false);

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
          queryClient.refetchQueries({
            queryKey: ["useBalanceToken"],
            exact: false,
          });

          if (result.status === "success") {
            setIsOpenSuccess(true);
          } else {
            setIsOpenError(true);
          }

          setLoading(false);
        }, 1500);
      }
    } catch (error) {
      setIsOpenConfirmAddLiquidity(false);
      setIsOpenAddLiquidity(false);
      setIsOpenTransaction(false);
      console.error(error);
      setIsOpenError(true);
    }
  };

  return (
    <div className="h-fit w-[360px] md:w-[400px] lg:w-[480px] rounded-lg relative">
      <p className="pb-4 title_modal">Create Pool</p>
      <div className="text-sm text-shader_200">
        <div className="flex items-center pb-4 border-b gap-x-3 border-shader_500">
          <div className="w-[65px] h-[65px] rounded-lg overflow-hidden">
            <MediaCollection avatar={formatLinkIPFS(data?.avatar)} />
          </div>
          <div>
            <p className="text-base title">{data?.name}</p>
            <div className="flex items-center gap-x-1">
              <a
                href={`${demask.urltxHash}address/${collectionAddress}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                {`${collectionAddress.slice(0, 8)}...${collectionAddress.slice(
                  -8
                )}`}
              </a>
              <Copy content={collectionAddress} />
            </div>
          </div>
        </div>
        <div className="flex flex-col py-4 gap-y-2">
          <div className="flex justify-between ">
            <p>NFT quantity</p>
            <div className="flex items-center font-bold text-white gap-x-1">
              {inputNFT.length}
            </div>
          </div>
          <div className="flex justify-between ">
            <p>Liquidity</p>
            <div className="flex gap-x-1">
              <div className="flex items-center font-bold text-white gap-x-1">
                <FormatNumber number={dataTradingAdd.amountETH || 0} />
                <TokenIcon token={String(tokenAddress?.symbol)} w={14} h={14} />
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
                    Output is estimated. You will receive at least {inputNFT}{" "}
                    NFT or the transaction will revert
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
          <p className="text-sm text-primary_300">
            Output is estimated. You will receive at least {inputNFT.length}
            NFT or the transaction will revert
          </p>
          <div className="flex justify-between p-3 mt-2 font-semibold rounded-lg bg-primary_500 bg-opacity-10">
            <p className="text-primary_200">Total {tokenAddress?.symbol}</p>
            <div className="flex items-center font-bold text-white gap-x-1">
              <FormatNumber
                number={dataTradingAdd.amountETH || inputToken || 0}
              />
              <TokenIcon token={String(tokenAddress?.symbol)} w={14} h={14} />
            </div>
          </div>
        </div>
        <div className="flex flex-col items-center mt-6">
          <Button
            disabled={
              isFetching ||
              Math.floor(dataTradingAdd.amountETHDecimals) === 0 ||
              isSufficientToken ||
              loading
            }
            primary={!isFetching && !isSufficientToken}
            className="w-[144px] py-2"
            active={
              isFetching ||
              Math.floor(dataTradingAdd.amountETHDecimals) === 0 ||
              isSufficientToken ||
              loading
            }
            onClick={handleAddLiquidity}
          >
            {!tokenAddress?.isNative && currentAllowance <= inputToken
              ? "Approve Token"
              : "Add Liquidity"}

            {isFetching && (
              <BiLoaderAlt className="ml-1 text-white animate-spin" />
            )}
          </Button>
        </div>
      </div>
      <ModalTransation
        isOpenTransation={isOpenTransaction}
        setIsOpenTransaction={setIsOpenTransaction}
      />
    </div>
  );
};

export default memo(ModalConfirmAddLiquidityERC721);
