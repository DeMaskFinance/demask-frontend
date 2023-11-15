import abiCreator from "@/abi/abiCreator.json";
import { ethers } from "ethers";
import { useContext, useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Button from "../Buttons/Button";

import AccountContext from "@/context/AccountContext";
import { getProvider } from "@/libs/connection/getProvider";
import getMetadataUrl from "@/libs/utils/getMetadata";
import { checkNetwork } from "@/libs/validation";
import checkIsERC20 from "@/libs/validation/checkIsERC20";
import { useQuery } from "@tanstack/react-query";
import BigNumber from "bignumber.js";
import { BiLoaderAlt } from "react-icons/bi";
import { HiArrowRight } from "react-icons/hi";
import { Processing } from "../Loading";
import { ModalWallet } from "../Modal/ModalWallet";
import TransitionURL from "../Toast/TransionURL";
import InputField from "./InputField";

import { categoryAPI } from "@/libs/service/categoriesChartService";
import handleBignumber from "@/libs/utils/handleBignumber";
import { AiOutlineExclamation } from "react-icons/ai";
import { ModalTransation } from "../Modal/ModalTransation";
import { changeNetwork } from "@/libs/utils/changeNetwork";
import { exponentialToDecimal } from "@/libs/utils/convertExponential";
import { usePreventUserFromErasingContent } from "@/hooks/usePreventUserFromErasingContent";
interface LauchPadProps {
  name: string;
  symbol: string;
  attributeItems: object[];
  description: string;
  fileIPFS: any;
  selectedCategory: string[];
  setEmptyInputs: React.Dispatch<React.SetStateAction<string[]>>;
  emptyInputs: string[];
  setName: React.Dispatch<React.SetStateAction<string>>;
  setSelectedCategory: React.Dispatch<React.SetStateAction<string[]>>;
  setAttributeItems: React.Dispatch<
    React.SetStateAction<
      {
        id: number;
        trait_type: string;
        value: string;
      }[]
    >
  >;
  setDescription: React.Dispatch<React.SetStateAction<string>>;
  setSymbol: React.Dispatch<React.SetStateAction<string>>;
  setSelectedFile: React.Dispatch<any>;
  fileType: string | null;
  setFileIPFS: React.Dispatch<any>;
}
const styles = {
  title: "block mb-4 text-base font-semibold text-black24",
  inputItem: "w-full py-2 pl-2 mb-4 border rounded-lg border-dark3 block",
  btnActive: "rounded-full bg-base2",
};
const LauchPad: React.FunctionComponent<LauchPadProps> = ({
  name,
  symbol,
  attributeItems,
  description,
  fileIPFS,
  selectedCategory,
  setEmptyInputs,
  emptyInputs,
  setName,
  setSelectedCategory,
  setAttributeItems,
  setDescription,
  setSymbol,
  setFileIPFS,
  setSelectedFile,
  fileType,
}) => {
  const [initial, setInitial] = useState<any>();
  const [totalSale, setTotalSale] = useState<number | null>();
  const [percentLock, setPercentLock] = useState<any>();
  const [priceListing, setPriceListing] = useState<any>();
  const [maxBuy, setMaxBuy] = useState<any>();
  const [isRefundType, setIsRefundType] = useState<boolean>(false);
  const [isWhiteList, setIsWhiteList] = useState<boolean>(false);
  const [isVesting, setIsVesting] = useState<boolean>(false);
  const [tokenPayment, setTokenPayment] = useState<string>("");
  const [price, setPrice] = useState<any>();
  const [launchActive, setLaunchActive] = useState<string>("NOW");
  const [inforErc20, setInforErc20] = useState<any>("");
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [durationLock, setDurationLock] = useState<Date | null>(null);
  const [vestingTime, setVestingTime] = useState<any>(0);
  const [isErrorTime, setIsErrorTime] = useState(false);
  const [isProcess, setIsProcess] = useState<boolean>(false);
  const [isTokenPayment, setIsTokenPayment] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const { account, updateAccount, wallet, demask, chainId, tokenDefault } = useContext(AccountContext);
  const contractAddress = demask.CREATOR; // Creator
  const [softCap, setSoftCap] = useState<any>();
  const [hardCap, setHardCap] = useState<any>();
  const [tge, setTge] = useState<any>(0);
  const [active, setActive] = useState<boolean>(false);
  const [royaltiesFee, setRoyaltiesFee] = useState<number | null>();
  const [isOpenTransaction, setIsOpenTransaction] = useState<boolean>(false);
  const [validFee, setValidFee] = useState<boolean>(false);
  const [checkExit, setCheckExit] = useState<boolean>(false);
  const handleDateChange = (date: Date | null) => {
    setStartDate(date);
    setLaunchActive("CUSTOM");
    setIsErrorTime;
  };
  const handleChangeRoyalFee = (e: any) => {
    setRoyaltiesFee(Number(e.target.value))
    if (e.target.value < 0 || e.target.value > 100) {
      setValidFee(true);
    } else {
      setValidFee(false);
    }
  }
  usePreventUserFromErasingContent(checkExit);
  useEffect(() => {
    if (name || symbol || description || fileIPFS || initial || percentLock || softCap || hardCap || price || priceListing || maxBuy || royaltiesFee) {
      setCheckExit(true)
    } else {
      setCheckExit(false)
    }
  }, [name || symbol, description, fileIPFS, initial, percentLock, softCap, hardCap, price, priceListing, maxBuy, royaltiesFee])


  const { isLoading, refetch, data, isFetching } = useQuery({
    queryKey: ["tokenPayment", tokenPayment],
    queryFn: async () => {
      const res = await categoryAPI(
        `/token?chainId=280&tokenAddress=${tokenPayment}`
      );
      return res;
    },

    refetchInterval: 60000,
  });
  const filterPassedTime = (time: any) => {
    const currentDate = new Date();
    const selectedDate = new Date(time);

    // Ensure selected date is in the future and greater than startDate
    {/* @ts-ignore */ }
    return currentDate?.getTime() < selectedDate?.getTime() && selectedDate?.getTime() > startDate?.getTime();
  };
  const decimal = data?.tokenDecimals;

  const checkSoftcap = Math.floor(
    (softCap * (price * 1e18) * (percentLock * 10000)) /
    (priceListing * 1e18 * 1000000)
  );
  console.log(checkSoftcap);
  useEffect(() => {
    if (startDate && endDate && startDate > endDate) {
      setIsErrorTime(true);
    } else {
      setIsErrorTime(false);
    }
  }, [startDate, endDate]);

  const getTimeLock = (startDate: any, endDate: any) => {
    const timeDifference =
      startDate?.getTime() / 1000 - endDate?.getTime() / 1000;

    if (timeDifference < 0) {
      return "Expires";
    }
    const minutes = Math.floor((timeDifference / 60) % 60);
    const hours = Math.floor((timeDifference / (60 * 60)) % 24);
    const days = Math.floor(timeDifference / (60 * 60 * 24));

    // Format the result
    const result = `${days}d${days > 1 ? "" : ""}: ${hours}h${hours > 1 ? "" : ""
      }: ${minutes}m${minutes > 1 ? "" : ""}
    `;

    return result;
  };

  const getMinutes = (startDate: any, endDate: any) => {
    const timeDifference = startDate - endDate;

    const totalMinutes = Math.floor(timeDifference / (1000 * 60));

    return totalMinutes;
  };
  const launchPadAction = async ({
    initial,
    priceLauchpad,
    startDate,
    decimal,
    endDate,
    royaltiesFee,
    url,
    data,
    durationLock,
    isRefundType,
    isWhiteList,
    softCap,
    hardCap,
    vestingTime,
    isVesting,
    tge,
  }: any) => {
    const ethereum = (window as any).ethereum;
    if (typeof ethereum === "undefined") {
      alert("Please install MetaMask to launch pad NFTs.");
      return;
    }

    try {
      const providerChoice = getProvider(wallet);
      const provider = new ethers.providers.Web3Provider(providerChoice);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(contractAddress, abiCreator, signer);
      const checkExists = async (id: number): Promise<boolean> => {
        const isExisting = await contract.exists(id);
        return isExisting;
      };
      const generateRandomNumber = (): number => {
        return Math.floor(Math.random() * 10000000000);
      };
      const networkSwitched = await changeNetwork(chainId, wallet, demask, setIsOpen);
      if (!networkSwitched) {
        return;
      }

      const checkAndLauchPadSubmit = async () => {
        const randomID = generateRandomNumber();
        const isExisting = await checkExists(randomID);
        if (isExisting) {
          checkAndLauchPadSubmit();
        } else {
          const startTimeTimestamp = startDate.getTime() / 1000;
          const endTimeTimestamp = endDate.getTime() / 1000;
          const durationLockTimestamp = getMinutes(durationLock, endDate);
          const vestingTimeConvert = isVesting
            ? getMinutes(vestingTime, endDate)
            : vestingTime;
          console.log(
            account,
            tokenPayment,
            randomID,
            initial,
            softCap,
            hardCap,
            percentLock * 10000,
            handleBignumber(price, decimal),
            handleBignumber(priceListing, decimal),
            startTimeTimestamp.toFixed(0),
            endTimeTimestamp.toFixed(0),
            durationLockTimestamp.toFixed(0),
            maxBuy,
            vestingTimeConvert.toFixed(0),
            tge * 10000,
            isRefundType,
            isWhiteList,
            isVesting
          );
          setIsOpenTransaction(true);
          const transaction = await contract.launchpadSubmit(

            [
              account,
              tokenPayment,
              randomID,
              initial,
              softCap,
              hardCap,
              percentLock * 10000,
              handleBignumber(price, decimal),
              handleBignumber(priceListing, decimal),
              startTimeTimestamp.toFixed(0),
              endTimeTimestamp.toFixed(0),
              durationLockTimestamp.toFixed(0),
              maxBuy,
              vestingTimeConvert.toFixed(0),
              tge * 10000,
              isRefundType,
              isWhiteList,
              isVesting,
            ],
            exponentialToDecimal(royaltiesFee * 100),
            url,
            data, { gasLimit: 8000000 }
          );

          const check = await provider.waitForTransaction(transaction.hash);
          setIsOpenTransaction(false);

          if (check.status === 1) {
            toast.success(
              <TransitionURL
                type={"Launchpad success"}
                transactionHash={transaction.hash}
              />,
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
              <TransitionURL
                type={"Launchpad failed"}
                transactionHash={transaction.hash}
              />,
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
          setName("");
          setDescription("");
          setSymbol("");
          setAttributeItems([{ id: 0, trait_type: "", value: "" }]);
          setSelectedCategory([]);
          setSelectedFile(null);
          setFileIPFS(null);
          setInitial(0);
          setTotalSale(null);
          setPrice(null);
          setPriceListing(null);
          setMaxBuy(null);
          setPercentLock(null);
          setTokenPayment("");
          setStartDate(null);
          setEndDate(null);
          setActive(false);
          setDurationLock(null);
          setRoyaltiesFee(null);
          setSoftCap(null);
          setHardCap(null);
        }
      };
      await checkAndLauchPadSubmit();
    } catch (error) {
      console.error("Failed to Launchpad:", error);
    }
    setIsProcess(false);
  };

  const handleTokenPaymentChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setTokenPayment(e.target.value);
    const value = e.target.value;
    setIsTokenPayment(true);
    const informationErc20 = await checkIsERC20(value);
    setInforErc20(informationErc20);
    setIsTokenPayment(false);
  };

  const handleLauchpadSubmit = async () => {
    if (account) {
      if (checkSoftcap <= 0) {
        toast.error("Increase the number of softcap", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
        return;
      }

      setIsProcess(true);
      const emptyInputFields = [];
      const requiredFields = [
        "name",
        "symbol",
        "initial",
        "tokenPayment",
        "priceListing",
        "maxBuy",
        "price",
        "percentLock",
        "durationLock",
        "hardCap",
        "softCap",
      ];
      requiredFields.forEach((field) => {
        if (!eval(field)) {
          emptyInputFields.push(field);
        }
      });
      if (fileIPFS === null) {
        emptyInputFields.push("fileIPFS");
        toast.error("File not found.Try again!", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      }

      if (inforErc20.isERC20 === false) {
        emptyInputFields.push("NotErc20");
      }
      if (startDate === null || endDate === null) {
        emptyInputFields.push("wrongtime");
      }
      setEmptyInputs(emptyInputFields);
      const priceLauchpad = new BigNumber(price)
        .times(new BigNumber(10).pow(Number(inforErc20.decimals)))
        .toFixed();

      if (emptyInputFields.length === 0 && !validFee) {
        const urlMetadata = getMetadataUrl({
          attributeItems,
          fileType,
          fileIPFS,
          name,
          symbol,
          description,
          selectedCategory,
        });

        launchPadAction({
          initial,
          decimal,
          softCap,
          hardCap,
          vestingTime,
          tge,
          priceLauchpad,
          startDate,
          endDate,
          data: "0x",
          maxBuy,
          priceListing,
          durationLock,
          percentLock,
          isRefundType,
          isWhiteList,
          isVesting,
          royaltiesFee,
          url: await urlMetadata,
        });
      } else {
        console.log("error");
        setIsProcess(false);
      }
    } else {
      setIsOpen(true);
    }
  };

  const listInput = [
    {
      id: "initial",
      label: "Initial",
      placeholder: "Initial",
      type: "number",
      value: initial,
      onChange: (e: any) => setInitial(e.target.value),
      isError: emptyInputs.includes("initial"),
      errorMsg: "Required",
    },
    {
      id: "softCap",
      label: "Softcap",
      placeholder: "Softcap",
      type: "number",
      value: softCap,
      onChange: (e: any) => setSoftCap(e.target.value),
      isError: emptyInputs.includes("softCap"),
      errorMsg: "Required",
    },
    {
      id: "hardCap",
      label: "Hardcap",
      placeholder: "Hardcap",
      type: "number",
      value: hardCap,
      onChange: (e: any) => setHardCap(e.target.value),
      isError: emptyInputs.includes("hardCap"),
      errorMsg: "Required",
    },

    {
      id: "percentLock",
      label: "Percent Lock (%)",
      placeholder: "Percent Lock",
      type: "number",
      value: percentLock,
      onChange: (e: any) => setPercentLock(e.target.value),
      isError: emptyInputs.includes("percentLock"),
      errorMsg: "Required",
    },
  ];

  const listInputPrice = [
    {
      id: "price",
      label: "Price",
      placeholder: "Price",
      type: "number",
      value: price,
      onChange: (e: any) => setPrice(e.target.value),
      isError: emptyInputs.includes("price"),
      errorMsg: "Required",
    },

    {
      id: "priceListing",
      label: "Price Listing",
      placeholder: "Price Listing",
      type: "number",
      value: priceListing,
      onChange: (e: any) => setPriceListing(e.target.value),
      isError: emptyInputs.includes("priceListing"),
      errorMsg: "Required",
    },
  ];

  const handleVesting = () => {
    setIsVesting(!isVesting);
    if (!isVesting) {
      setVestingTime(0);
      setTge(0);
    }
  };

  useEffect(() => { }, [isOpenTransaction]);
  return (
    <div>
      {listInput.map((item, index) => (
        <div key={index}>
          <InputField
            id={item.id}
            label={item.label}
            placeholder={item.label}
            type={item.type}
            value={item.value}
            onChange={item.onChange}
            isError={item.isError}
            errorMsg={item.errorMsg}
            emptyInputs={emptyInputs}
            styles={styles}
          />
        </div>
      ))}

      <div className="relative">
        <label htmlFor="tokenPayment" className={styles.title}>
          <span className="">Token Payment</span>
          <span className="text-red">*</span>
        </label>
        <div className="relative">
          <input
            placeholder="Paste token or choose"
            type="text"
            autoComplete="off"
            id="tokenPayment"
            value={tokenPayment || ""}
            className={
              emptyInputs.includes("tokenPayment")
                ? "w-full py-2 pl-2 mb-4 rounded-lg border-2 border-red block"
                : styles.inputItem
            }
            onChange={handleTokenPaymentChange}
            onFocus={() => {
              setActive(true);
            }}
          // onBlur={() => {
          //   setActive(false);
          // }}
          />

        </div>
        {active && (
          <div className="flex flex-col gap-2 p-2 mb-2 border-b border-l border-r rounded-xl">
            {tokenDefault.map((item: any, index: number) => (
              <span
                key={index}
                className={`border block text-center py-0.5 text-base text-black24 w-full px-1 rounded-lg cursor-pointer ${item.token === tokenPayment
                  ? "bg-secondary5 text-white"
                  : "hover:bg-secondary5 hover:text-white"
                  }`}
                onClick={() => {
                  setTokenPayment(item.address);
                }}
              >
                {item.symbol}
              </span>
            ))}
          </div>
        )}
        {isLoading ? (
          <div className="flex items-center justify-center p-2 mb-2 border-b border-l border-r rounded-xl">
            <BiLoaderAlt className="text-xl animate-spin text-secondary5" />
          </div>
        ) : (
          <>
            {data && data.tokenName ? (
              <div className="p-2 mb-2 border-b border-l border-r rounded-xl">
                <p className="flex items-center gap-2">
                  Name:{" "}
                  <span className="font-semibold">
                    {data?.tokenName || (
                      <BiLoaderAlt className="animate-spin text-secondary5" />
                    )}
                  </span>
                </p>
                <p className="flex items-center gap-2">
                  Symbol:{" "}
                  <span className="font-semibold">
                    {data.tokenSymbol || (
                      <BiLoaderAlt className="animate-spin text-secondary5" />
                    )}
                  </span>
                </p>
                <p className="flex items-center gap-2">
                  Total Supply:{" "}
                  <span className="font-semibold">
                    {data.tokenTotalSupply / 1e18 || (
                      <BiLoaderAlt className="animate-spin text-secondary5" />
                    )}
                  </span>
                </p>
              </div>
            ) : (
              <p
                className="mb-2 ml-3 -mt-1 text-xs text-red"
                key="totalPayment"
              >
                Your token payment must be an ERC20 token
              </p>
            )}
          </>
        )}

        {emptyInputs.includes("tokenPayment") && (
          <p className="mb-2 ml-3 -mt-1 text-xs text-red" key="totalPayment">
            Required
          </p>
        )}
      </div>

      {listInputPrice.map((item) => (
        <>
          <InputField
            id={item.id}
            label={item.label}
            placeholder={item.label}
            type={item.type}
            value={item.value}
            onChange={item.onChange}
            isError={item.isError}
            errorMsg={item.errorMsg}
            emptyInputs={emptyInputs}
            styles={styles}
          />
        </>
      ))}
      <div>
        <label htmlFor="royaltiesFee" className={styles.title}>
          <span>Royalties Fee (%)</span>
          <span className="text-red">*</span>
        </label>

        <input
          placeholder="100"
          type="number"
          id="royaltiesFee"
          autoComplete="off"
          value={royaltiesFee || ""}
          className={
            emptyInputs.includes("royaltiesFee")
              ? "w-[200px] py-2 pl-2 mb-4 rounded-lg border-2 border-red"
              : styles.inputItem
          }
          onChange={(e) => handleChangeRoyalFee(e)}
        />
        {emptyInputs.includes("royaltiesFee") && (
          <p className="mb-2 ml-3 -mt-1 text-xs text-red" key="initial">
            Required
          </p>
        )}
        {validFee && (
          <p className="mb-2 -mt-1 text-xs text-red" key="initial">
            Royalties fee must be less than 0% and greater than 100%
          </p>
        )}
      </div>
      <div>
        <label htmlFor="time" className={styles.title}>
          <span className="">Start & end time</span>
          <span className="text-red">*</span>
        </label>

        <div className="flex justify-between gap-x-4">
          <div className="mb-4 border rounded-lg border-dark2 w-[45%]">
            <DatePicker
              selected={startDate}
              onChange={handleDateChange}
              timeIntervals={15}
              showTimeSelect
              dateFormat="MMMM d, yyyy h:mm aa"
              className="w-full h-full py-3 pl-2 border-none rounded-lg text-customDate"
              placeholderText="Now"
              selectsStart
              startDate={startDate}
              endDate={endDate}
            />
          </div>
          <HiArrowRight className="translate-y-[75%]" />
          <div className="mb-4 border rounded-lg border-dark2 w-[45%]">

            <DatePicker
              selected={endDate}
              onChange={(date) => setEndDate(date)}
              timeIntervals={15}
              showTimeSelect
              selectsEnd
              startDate={startDate}
              endDate={endDate}
              /* @ts-ignore */
              minDate={startDate ? new Date(Math.max(startDate, new Date())) : new Date()}
              filterTime={filterPassedTime}
              dateFormat="MMMM d, yyyy h:mm aa"
              className="w-full h-full py-3 pl-2 border-none rounded-lg text-customDate"
              placeholderText="Forever"
            />
          </div>
        </div>
        {isErrorTime && (
          <p className="mb-2 ml-3 -mt-1 text-xs text-red" key="price">
            Start time should be earlier than End time
          </p>
        )}
        {emptyInputs.includes("wrongtime") && (
          <p className="mb-2 ml-3 -mt-1 text-xs text-red" key="time">
            You have to enter the time
          </p>
        )}
      </div>

      <div>
        <label htmlFor="durationLock" className={styles.title}>
          <span className="">Duration Lock</span>
          <span className="text-red">*</span>
        </label>
        <div className="flex items-baseline gap-4">
          <div className="mb-4 border rounded-lg border-dark2 w-[45%]">
            {/* @ts-ignore */}

            <DatePicker
              selected={durationLock}
              onChange={(date) => setDurationLock(date)}
              timeIntervals={15}
              showTimeSelect
              selectsEnd
              startDate={endDate}
              endDate={durationLock}
              minDate={new Date()}
              dateFormat="MMMM d, yyyy h:mm aa"
              className="w-full h-full py-3 pl-2 border-none rounded-lg text-customDate"
              placeholderText="Forever"
            />
          </div>
          <span>{durationLock ? getTimeLock(durationLock, endDate) : ""}</span>
        </div>
      </div>
      {emptyInputs.includes("durationLock") && (
        <p className="mb-2 ml-3 -mt-1 text-xs text-red" key="time">
          You have to enter the time
        </p>
      )}

      <InputField
        id="maxBuy"
        label="Max buy"
        placeholder="500"
        type="number"
        value={maxBuy}
        onChange={(e) => setMaxBuy(e.target.value)}
        isError={emptyInputs.includes("maxBuy")}
        errorMsg="Required"
        emptyInputs={emptyInputs}
        styles={styles}
      />

      <div className="flex items-center gap-2 mb-6">
        <label className="relative inline-flex items-center gap-2 cursor-pointer">
          <span
            onClick={handleVesting}
            className={"text-base font-semibold text-black24"}
          >
            Vesting
          </span>
          <div className="relative">
            <input
              type="checkbox"
              value=""
              className="outline-none sr-only peer"
              checked={isVesting}
            />
            <div
              onClick={handleVesting}
              className={`w-11 h-6 rounded-full peer  ${isVesting ? "bg-secondary5" : "bg-gray-400"
                } peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all border-gray-600 peer-checked:bg-blue-600`}
            ></div>
          </div>
        </label>
      </div>

      {isVesting && (
        <div className="p-4 mb-4 border rounded-md">
          <InputField
            id="tge"
            label="TGE"
            placeholder="1%"
            type="number"
            value={tge}
            onChange={(e) => setTge(e.target.value)}
            isError={emptyInputs.includes("tge")}
            errorMsg="Required"
            emptyInputs={emptyInputs}
            styles={styles}
            tooltip="Initial NFT quantity is unlocked"
          />

          <div className="relative">
            <label htmlFor="vestingTime" className={styles.title}>
              <div className="flex items-end gap-2">
                <div className="pb-1 transition-all group">
                  <span className="bg-yellow rounded-full block p-0.5 text-xs text-secondary3">
                    <AiOutlineExclamation />
                  </span>
                  <p className="absolute z-10 hidden px-4 py-2 text-sm text-gray-500 transition-all bg-white border rounded-md font-base w-fit group-hover:block top-6">
                    NFT unlock period after the end of the launchpad period.
                  </p>
                </div>
                <div className="flex gap-2">
                  <span className="">Vesting time</span>
                  <span className="text-red">*</span>
                </div>
              </div>
            </label>
            <div className="flex items-baseline gap-4">
              <div className="mb-4 border rounded-lg border-dark2 w-[45%]">
                {/* @ts-ignore */}
                <DatePicker
                  selected={vestingTime}
                  onChange={(date) => setVestingTime(date)}
                  timeIntervals={15}
                  showTimeSelect
                  selectsEnd
                  startDate={endDate}
                  endDate={vestingTime}
                  minDate={new Date()}
                  dateFormat="MMMM d, yyyy h:mm aa"
                  className="w-full h-full py-3 pl-2 border-none rounded-lg text-customDate"
                  placeholderText="Forever"
                />
              </div>
              <span>
                {vestingTime ? getTimeLock(vestingTime, endDate) : ""}
              </span>
            </div>
            {emptyInputs.includes("vestingTime") && (
              <p className="mb-2 ml-3 -mt-1 text-xs text-red" key="time">
                You have to enter the time
              </p>
            )}
          </div>
        </div>
      )}

      <div>
        <label htmlFor="isRefundType" className={styles.title}>
          <span className="">Refund Type</span>
          <span className="text-red">*</span>
        </label>

        <div className="flex gap-4 mb-4">
          <div className="flex items-center px-2 border rounded-lg">
            <input
              id="burn"
              onChange={() => {
                setIsRefundType(true);
              }}
              type="radio"
              name="refundtype"
            />
            <label
              htmlFor="burn"
              className="w-full p-2 text-sm font-medium text-gray-600"
            >
              Burn
            </label>
          </div>

          <div className="flex items-center px-2 border rounded-lg">
            <input
              id="refund"
              onChange={() => {
                setIsRefundType(false);
              }}
              type="radio"
              name="refundtype"
            />
            <label
              htmlFor="refund"
              className="w-full p-2 text-sm font-medium text-gray-600"
            >
              Refund
            </label>
          </div>
        </div>
      </div>

      <div>
        <label htmlFor="isWhiteList" className={styles.title}>
          <span className="">Whitelist</span>
          <span className="text-red">*</span>
        </label>

        <div className="flex gap-4 mb-4">
          <div className="flex items-center px-2 border rounded-lg">
            <input
              id="public"
              onChange={() => {
                setIsWhiteList(true);
              }}
              type="radio"
              name="bordered-radio"
            />
            <label
              htmlFor="public"
              className="w-full p-2 text-sm font-medium text-gray-600"
            >
              Public
            </label>
          </div>

          <div className="flex items-center px-2 border rounded-lg">
            <input
              id="private"
              onChange={() => {
                setIsWhiteList(false);
              }}
              type="radio"
              name="bordered-radio"
            />
            <label
              htmlFor="private"
              className="w-full p-2 text-sm font-medium text-gray-600"
            >
              Private
            </label>
          </div>
        </div>
      </div>

      <div className="relative">
        <div>
          <Button
            type="button"
            className="w-[140px] py-2"
            primary
            onClick={handleLauchpadSubmit}
          // onClick={handleLaunchPad}
          >
            CREATE
          </Button>
          {isProcess && <Processing />}
        </div>

        <ModalWallet isOpen={isOpen} setIsOpen={setIsOpen} />
      </div>

      <ModalTransation
        isOpenTransation={isOpenTransaction}
        setIsOpenTransaction={setIsOpenTransaction}
        isTransaction={true}
      />
    </div>
  );
};

export default LauchPad;
