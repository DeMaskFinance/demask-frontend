import { useState, useRef, useEffect, useContext } from "react";
import DatePicker from "react-datepicker";
import Button from "../Buttons/Button";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ethers } from "ethers";
import abiErc1155 from "@/abi/abiErc1155.json";
import abiCreator from "@/abi/abiCreator.json";

import TransitionURL from "../Toast/TransionURL";
import checkIsERC20 from "@/libs/validation/checkIsERC20";
import { Processing } from "../Loading";
import { HiArrowRight } from "react-icons/hi";
import getMetadataUrl from "@/libs/utils/getMetadata";
import { BiLoaderAlt } from "react-icons/bi";
import BigNumber from "bignumber.js";
import { getProvider } from "@/libs/connection/getProvider";
import { ModalWallet } from "../Modal/ModalWallet";
import AccountContext from "@/context/AccountContext";
import { checkNetwork } from "@/libs/validation";
import InputField from "./InputField";
import { useQuery } from "@tanstack/react-query";

import { categoryAPI } from "@/libs/service/categoriesChartService";
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
  const [percentLock, setPercentLock] = useState<number | null>();

  const [priceListing, setPriceListing] = useState<any>();
  const [maxBuy, setMaxBuy] = useState<any>();
  const [isRefundType, setIsRefundType] = useState<boolean>(false);
  const [isWhiteList, setIsWhiteList] = useState<boolean>(false);

  const [tokenPayment, setTokenPayment] = useState<string>("");
  const [price, setPrice] = useState<any>();
  const [launchActive, setLaunchActive] = useState<string>("NOW");
  const [inforErc20, setInforErc20] = useState<any>("");
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  const [durationLock, setDurationLock] = useState<Date | null>(null);

  const [isError, setIsError] = useState(false);
  const [isProcess, setIsProcess] = useState<boolean>(false);
  const [isTokenPayment, setIsTokenPayment] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const { account, updateAccount, wallet, demask } = useContext(AccountContext);
  const contractAddress = demask.CREATOR; // Creator
  const handleDateChange = (date: Date | null) => {
    setStartDate(date);
    setLaunchActive("CUSTOM");
    setIsError;
  };

  const { isLoading, refetch, data, isFetching } = useQuery({
    queryKey: ["tokenPayment"],
    queryFn: async () => {
      const res = await categoryAPI(
        `v2/token?chainId=80001&tokenAddress=${tokenPayment}`
      );
      return res;
    },

    refetchInterval: 60000,
  });

  useEffect(() => {
    if (startDate && endDate && startDate > endDate) {
      setIsError(true);
    } else {
      setIsError(false);
    }
  }, [startDate, endDate]);
  interface LaunchPadProps {
    initial: number;
    price: number;
    totalSale: number;
  }
  let transactionHash = "";
  const launchPadAction = async ({
    initial,
    priceLauchpad,
    startDate,
    endDate,
    url,
    data,
    durationLock,
    totalSale,
    isRefundType,
    isWhiteList,
  }: any) => {
    const totalSupply = initial + totalSale;
    console.log(
      initial,
      priceLauchpad,
      totalSale,
      totalSupply,
      startDate.getTime() / 1000,
      url,
      data,
      endDate.getTime() / 1000
    );

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
      const networkSwitched = await checkNetwork(providerChoice);
      if (!networkSwitched) {
        return;
      }
      console.log("check1");

      const checkAndLauchPadSubmit = async () => {
        const randomID = generateRandomNumber();
        const isExisting = await checkExists(randomID);
        if (isExisting) {
          checkAndLauchPadSubmit();
          console.log("check2");
        } else {
          const startTimeTimestamp = startDate.getTime() / 1000;
          const endTimeTimestamp = endDate.getTime() / 1000;
          const durationLockTimestamp = durationLock.getTime() / 1000;

          const transaction = await contract.launchpad_submit(
            [
              account,
              randomID,
              initial,
              totalSale,
              percentLock,
              price,
              priceListing,
              tokenPayment,
              startTimeTimestamp,
              endTimeTimestamp,
              durationLockTimestamp,
              maxBuy,
              isRefundType,
              isWhiteList,
              50000,
            ],
            url,
            data
          );
          await transaction.wait();
          transactionHash = transaction.hash;

          console.log(transactionHash);

          toast.success(
            <TransitionURL
              type={"Launchpad"}
              transactionHash={transactionHash}
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
        "totalSale",
        "durationLock",
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
      console.log(priceLauchpad);

      if (emptyInputFields.length === 0) {
        console.log("check 1");
        const urlMetadata = getMetadataUrl({
          attributeItems,
          fileType,
          fileIPFS,
          name,
          symbol,
          description,
          selectedCategory,
        });
        console.log("pass URL meta");

        launchPadAction({
          initial,
          priceLauchpad,
          startDate,
          endDate,
          data: "0x",
          totalSale,
          maxBuy,
          priceListing,
          durationLock,
          percentLock,
          isRefundType,
          isWhiteList,
          url: await urlMetadata,
        });
      } else {
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
      id: "totalSale",
      label: "TotalSale",
      placeholder: "TotalSale",
      type: "number",
      value: totalSale,
      onChange: (e: any) => setTotalSale(+e.target.value),
      isError: emptyInputs.includes("totalSale"),
      errorMsg: "Required",
    },

    {
      id: "percentLock",
      label: "Percent Lock",
      placeholder: "Percent Lock",
      type: "number",
      value: percentLock,
      onChange: (e: any) => setPercentLock(e.target.value),
      isError: emptyInputs.includes("percentLock"),
      errorMsg: "Required",
    },

    {
      id: "price",
      label: "Price",
      placeholder: "Price",
      type: "number",
      value: price,
      onChange: (e: any) => setPrice(e.target.value),
      isError: emptyInputs.includes("totalSale"),
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

  const convertTime = (timestamp: any) => {
    const secondsInADay = 60 * 60 * 24;
    const days = Math.floor(timestamp / secondsInADay);
    return days;
  };

  return (
    <div>
      {listInput.map((item) => (
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

      <div className="relative">
        <label htmlFor="tokenPayment" className={styles.title}>
          <span className="">Token Payment</span>
          <span className="text-red">*</span>
        </label>
        <div>
          <input
            placeholder="0x3248"
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
          />
          {isTokenPayment && (
            <div className="absolute top-[50%] right-2 -translate-y-1/2">
              <BiLoaderAlt className="animate-spin text-secondary5" />
            </div>
          )}
        </div>
        {inforErc20.isERC20 ? (
          <div className="mb-2">
            <p>Name:{inforErc20.name}</p>
            <p>Symbol:{inforErc20.symbol}</p>
            <p>Total Supply:{inforErc20.totalSupply}</p>
          </div>
        ) : (
          <p className="mb-2 ml-3 -mt-1 text-xs text-red" key="totalPayment">
            Your token payment must be an ERC20 token
          </p>
        )}
        {emptyInputs.includes("totalSale") && (
          <p className="mb-2 ml-3 -mt-1 text-xs text-red" key="totalPayment">
            Required
          </p>
        )}
      </div>

      <div>
        <label htmlFor="time" className={styles.title}>
          <span className="">Start & end time</span>
          <span className="text-red">*</span>
        </label>
        {/* <div className="grid h-[34px] grid-cols-2 rounded-full w-[120px] mb-4 text-sm bg-dark2 text-white">
          <button
            type="button"
            className={`${
              launchActive === "NOW" ? "rounded-full bg-base2" : ""
            }`}
            onClick={() => changeLaunchStart("NOW")}
          >
            NOW
          </button>
          <button
            type="button"
            className={`${
              launchActive === "CUSTOM" ? "rounded-full bg-base2" : ""
            }`}
            onClick={() => changeLaunchStart("CUSTOM")}
          >
            CUSTOM
          </button>
        </div> */}
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
              minDate={new Date()}
              dateFormat="MMMM d, yyyy h:mm aa"
              className="w-full h-full py-3 pl-2 border-none rounded-lg text-customDate"
              placeholderText="Forever"
            />
          </div>
        </div>
        {isError && (
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
        <div className="flex gap-4">
          <div className="mb-4 border rounded-lg border-dark2 w-[45%]">
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
          {/* <div className="mb-4 border rounded-lg border-dark2 w-[45%]">
            {convertTime(durationLock && durationLock.getTime() / 1000)}
          </div> */}
        </div>
      </div>

      {isError && (
        <p className="mb-2 ml-3 -mt-1 text-xs text-red" key="price">
          Start time should be earlier than End time
        </p>
      )}
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

      <div>
        <label htmlFor="isRefundType" className={styles.title}>
          <span className="">Refund Type</span>
          <span className="text-red">*</span>
        </label>

        <form className="flex gap-4 mb-4">
          <div className="flex items-center border px-2 rounded-lg">
            <input
              id="burn"
              onChange={() => {
                setIsRefundType(true);
              }}
              type="radio"
              name="bordered-radio"
            />
            <label
              htmlFor="burn"
              className="w-full text-sm p-2 font-medium text-gray-600"
            >
              Burn
            </label>
          </div>

          <div className="flex items-center border px-2 rounded-lg">
            <input
              id="refund"
              onChange={() => {
                setIsRefundType(false);
              }}
              type="radio"
              name="bordered-radio"
            />
            <label
              htmlFor="refund"
              className="w-full text-sm  p-2  font-medium text-gray-600"
            >
              Refund
            </label>
          </div>
        </form>
      </div>

      <div>
        <label htmlFor="isWhiteList" className={styles.title}>
          <span className="">Whitelist</span>
          <span className="text-red">*</span>
        </label>

        <form className="flex gap-4 mb-4">
          <div className="flex items-center border px-2 rounded-lg">
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
              className="w-full text-sm p-2 font-medium text-gray-600"
            >
              Public
            </label>
          </div>

          <div className="flex items-center border px-2 rounded-lg">
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
              className="w-full text-sm  p-2  font-medium text-gray-600"
            >
              Private
            </label>
          </div>
        </form>
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
      <ToastContainer />
    </div>
  );
};

export default LauchPad;
