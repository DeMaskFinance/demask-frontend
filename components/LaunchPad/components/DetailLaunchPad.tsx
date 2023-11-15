import AccountContext from "@/context/AccountContext";
import { LaunchPadAPI } from "@/libs/service/launchpadService";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";

import abiLaunchPad from "@/abi/abiLaunchPad.json";
import ModalLaunchPad from "@/components/Modal/ModalLaunchPad";
import { ModalWallet } from "@/components/Modal/ModalWallet";
import TransitionURL from "@/components/Toast/TransionURL";
import useInformationToken from "@/hooks/useInformationToken";
import { getProvider } from "@/libs/connection/getProvider";
import { categoryAPI } from "@/libs/service/categoriesChartService";
import { ethers } from "ethers";
import { toast } from "react-toastify";
import ProgressBar from "./ProgessLaunchPad";
import { IoReloadOutline } from "react-icons/io5";
import ModalAddAdminLaunchpad from "@/components/Modal/ModalLaunchpadProfile/ModalAddAdminLaunchpad";
import DetailLaunchPadInfo from "./DetailLaunchPadInfo";
import { exponentialToDecimal } from "@/libs/utils/convertExponential";
import MediaNFT from "@/components/Common/MediaNFT";

export default function DetailLaunchPad() {
  const [nftAddress, setNftAddress] = useState<string>("");
  const [tokenAddress, setTokenAddress] = useState<string>("");
  const [idNFT, setIdNFT] = useState<string>("");
  const [isOpenTransaction, setIsOpenTransaction] = useState<boolean>(false);
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);

  const [amountBuyDec, setAmountBuyDec] = useState<number>(1);
  const [isApprovedToken, setIsApprovedToken] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [checkApproveToken, setCheckApproveToken] = useState<boolean>(false);
  const [inputNFT, setInpuNFT] = useState<any>(1);

  const [openModalWhitelist, setOpenModalWhitelist] = useState<boolean>(false);
  const { account, wallet, chainId, demask, tokenDefault } =
    useContext(AccountContext);
  const [errors, setErrors] = useState<string>("");
  const { isLoading, data, isRefetching, isSuccess, refetch } = useQuery({
    queryKey: ["launchPad", idNFT, nftAddress, tokenAddress, chainId],
    queryFn: async () => {
      const res = await LaunchPadAPI(
        tokenAddress.toLocaleLowerCase(),
        nftAddress.toLowerCase(),
        idNFT,
        chainId,
        account
      );
      return res;
    },
  });

  console.log(data);
  const { isLoading: isLoadingToken, data: dataToken } = useQuery({
    queryKey: ["tokenPayment", tokenAddress, chainId],
    queryFn: async () => {
      const res = await categoryAPI(
        `/token?chainId=${chainId}&tokenAddress=${tokenAddress}`
      );
      return res;
    },

    refetchInterval: 60000,
  });

  useEffect(() => { }, [dataToken, idNFT]);

  const softcap = data?.softcap;
  const hardcap = data?.hardcap;
  const totalSold = data?.totalSold;


  const {
    ROUTER: routerAddress,
    RPC: rpc,
    NATIVE_ADDRESS: nativeAddress,
  } = demask;

  const tokenLaunchpad = data?.launchpad;

  const { balanceToken, bigNumberBalance, allowanceToken, isLoadingApprove } =
    useInformationToken(
      account,
      tokenAddress,
      wallet,
      tokenLaunchpad,
      // routerAddress,
      rpc,
      nativeAddress,
      isOpenTransaction
    );

  const currentTime = Math.floor(new Date().getTime() / 1000);
  const startTime = data?.startTime;
  const endTime = data?.endTime;

  const router = useRouter();
  const { detail } = router.query;

  const [amount, setAmount] = useState(1);
  console.log(data);

  useEffect(() => {
    if (detail) {
      setIdNFT(detail[0]);
      setNftAddress(detail[1]);
      setTokenAddress(detail[2]);
    }
  }, [detail]);

  useEffect(() => {
    if (data && data?.price) {
      setAmountBuyDec((data?.price / 1e18) * amount);
      setInpuNFT(amount * (data?.price / 1e18));
    }
  }, [amount, data]);

  const checkTime = currentTime > startTime && currentTime < endTime;

  const checkBalance =
    parseFloat(balanceToken) + amount <= parseFloat(data?.maxbuy);

  useEffect(() => {
    if (currentTime < startTime) {
      setErrors("Comming soon");
    } else if (!checkTime) {
      setErrors("Sold out");
    } else if (parseInt(totalSold) >= parseInt(hardcap)) {
      setErrors("Sold out");
    }
    // else if (!checkBalance) {
    //   setErrors("Expire date");
    // }
    else if (amount > data?.maxbuy) {
      setErrors("Amount express");
    } else {
      setErrors("");
    }
  }, [amount, startTime, endTime]);
  console.log(allowanceToken);

  useEffect(() => {
    const checkApproveToken = async () => {
      if (tokenAddress !== nativeAddress) {
        if (parseFloat(allowanceToken) < amountBuyDec) {
          setIsApprovedToken(false);
        } else {
          setIsApprovedToken(true);
        }
      } else {
        setIsApprovedToken(true);
      }
    };
    checkApproveToken();
  }, [isApprovedToken, allowanceToken]);
  console.log(isApprovedToken);
  console.log(tokenAddress);
  console.log(nativeAddress);

  const handleBuyNFT = async (e: any) => {
    e.preventDefault();
    if (!account) {
      setIsOpen(true);
      return;
    }

    const providerChoice = getProvider(wallet);
    const provider = new ethers.providers.Web3Provider(providerChoice);
    const signer = provider.getSigner();

    const contract = new ethers.Contract(tokenLaunchpad, abiLaunchPad, signer);
    try {
      let result;

      if (tokenAddress === nativeAddress) {
        setIsOpenTransaction(true);
        result = await contract.buyETH(amount, { gasLimit: 8000000, value: exponentialToDecimal(Number(data.price) * Number(amount)) });
      } else {
        setIsOpenTransaction(true);
        result = await contract.buy(amount, { gasLimit: 8000000 });
      }

      const check = await provider.waitForTransaction(result.hash);
      setIsOpenTransaction(false);
      setIsOpenModal(false);
      refetch();

      if (check.status === 1) {
        toast.success(
          <TransitionURL type={"Buy NFT success"} transactionHash={result.hash} />,
          {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: false,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
          }
        );
      } else {
        toast.error(
          <TransitionURL type={"Buy NFT failed"} transactionHash={result.hash} />,
          {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: false,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
          }
        );
      }

      setAmount(0);
    } catch (error) {
      setIsOpenTransaction(false);
      console.error(error);
    }
  };

  const listInfo = DetailLaunchPadInfo(data);

  return (
    <div>
      <h1 className="text-2xl font-medium">Detail Launchpad</h1>
      <div className="flex flex-col gap-4 mt-8 lg:flex-row">
        <div className="p-4 border rounded-lg lg:w-3/4">
          <div className="flex justify-end w-full mb-2">
            {/* <button
              onClick={() => {
                refetch();
              }}
              className="flex items-center gap-2 px-2 py-1 text-white border rounded-lg bg-secondary3 hover:bg-secondary5"
            >
              <IoReloadOutline /> Refetch
            </button> */}
          </div>
          {isLoading ? (
            <div className="h-[800px]">
              <div className="flex gap-8">
                <div className="h-[600px] bg-slate-200 lg:w-full animate-pulse rounded-lg"></div>
              </div>
            </div>
          ) : (
            data &&
            data?.metadata && (
              <>
                <div className="flex flex-col justify-between gap-8">
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl text-semibold">
                      {data?.metadata.name}{" "}
                    </h2>

                    <span className="block px-2 py-1 text-sm text-white rounded-md w-fit bg-secondary5">
                      {data?.status}
                    </span>
                  </div>

                  <div>
                    <p className="">{data?.metadata?.description}</p>
                  </div>

                  <div className="p-4 rounded-md">
                    <MediaNFT data={data} isControls/>
                  </div>
                  <div className="p-4 rounded-lg h-fit">
                    <div>
                      <div className="">
                        {listInfo?.map((item, index) => (
                          <div
                            className="flex justify-between py-2 border-b"
                            key={index}
                          >
                            <p className="text-sm font-semibold text-gray-700">
                              {item.name}
                            </p>
                            <p className="text-sm text-gray-700">
                              {item.value}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <ModalWallet isOpen={isOpen} setIsOpen={setIsOpen} />
              </>
            )
          )}
        </div>

        <div className="p-4 border rounded-lg lg:w-2/4 h-fit">
          <div>
            <div>
              <ProgressBar
                softcap={softcap}
                hardcap={hardcap}
                amount={totalSold}
                isRefetching={isRefetching}
              />

              <div className="flex justify-between px-6 mt-2 text-sm">
                <span className="w-fit">Softcap</span>
                <span className="w-fit">Sold</span>
                <span className="w-fit">Hardcap</span>
              </div>
            </div>
            <div className="mt-4 ">
              <div className="items-center w-full mb-4 ml-auto">
                <h2 className="mb-2 ml-auto text-xl">
                  {amount * (data?.price / 1e18)} {dataToken?.tokenSymbol}
                </h2>
              </div>

              <div className="flex gap-4 py-4">
                <div>
                  <span className="px-2 border rounded-md bg-slate-200 text-black24">
                    {data?.vestingStatus ? "Vesting" : "100%"}
                  </span>
                </div>

                <div>
                  {data?.whiteList ? (
                    <span className="px-2 text-white rounded-md bg-green">
                      Whitelist
                    </span>
                  ) : (
                    <span className="px-2 border rounded-md bg-slate-200 text-black24">
                      No whitelist
                    </span>
                  )}
                </div>
              </div>
              <label className="block">Amount NFT</label>
              <input
                onChange={(e) => setAmount(parseFloat(e.target.value))}
                type="number"
                // disabled={errors !== "" ? true : false}
                className="px-2 border rounded-md outline-none"
                value={amount}
              />

              <p className="text-red">{errors}</p>
            </div>

            <div className="flex gap-8">
              <button
                disabled={errors !== "" ? true : false}
                onClick={() => {
                  setIsOpenModal(!isOpenModal);
                }}
                className={`px-4 py-1 rounded-md mt-4 text-white  ${errors !== "" ? "bg-slate-400" : "bg-green"
                  }`}
              >
                Buy
              </button>

              {(data?.isAdmin || data?.creator === account) &&
                !data?.whiteList && (
                  <button
                    onClick={() => {
                      setOpenModalWhitelist(!openModalWhitelist);
                    }}
                    className={`px-4 py-1 rounded-md mt-4 text-white  ${"bg-secondary5"}`}
                  >
                    Add Whitelist
                  </button>
                )}

              <ModalAddAdminLaunchpad
                isOpenTransation={isOpenTransaction}
                isOpenModal={openModalWhitelist}
                setIsOpenModal={setOpenModalWhitelist}
                setIsOpenTransaction={setIsOpenTransaction}
                tokenLaunchpad={tokenLaunchpad}
                action={"whitelist"}
              />

              <ModalLaunchPad
                setIsOpenTransaction={setIsOpenTransaction}
                isOpenTransation={isOpenTransaction}
                setIsOpenModal={setIsOpenModal}
                isOpenModal={isOpenModal}
                account={account}
                wallet={wallet}
                tokenAddress={tokenAddress}
                inputNFT={inputNFT}
                routerAddress={tokenLaunchpad}
                setIsOpen={setIsOpen}
                checkApproveToken={isApprovedToken}
                setCheckApproveToken={setIsApprovedToken}
                nativeAddress={nativeAddress}
                handleBuyNFT={handleBuyNFT}
                isLoadingApprove={isLoadingApprove}
                refetch={refetch}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
