import { useState, useRef, useEffect, useContext } from "react";
import DatePicker from "react-datepicker";
import Button from "../Buttons/Button";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ethers } from "ethers";
import abiErc1155 from "@/abi/abiErc1155.json";
import TransitionURL from "../Toast/TransionURL";
import checkIsERC20 from "@/libs/validation/checkIsERC20";
import { Processing } from "../Loading";
import { HiArrowRight } from "react-icons/hi";
import getMetadataUrl from "@/libs/utils/getMetadata";
import { BiLoaderAlt } from "react-icons/bi";
import BigNumber from "bignumber.js";
import { getProvider } from "@/libs/connection/getProvider";
import { ModalWallet } from "../Modal/ModalWallet";
import { useAccount } from "@/hooks/useAccount";
import AccountContext from "@/context/AccountContext";
import { checkNetwork } from "@/libs/validation";
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
  setFileIPFS:React.Dispatch<any>;
}
const styles = {
  title: "block mb-4 text-base font-semibold text-black24",
  inputItem: "w-full py-2 pl-2 mb-4 border rounded-lg border-dark2",
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
  const [tokenPayment, setTokenPayment] = useState<string>("");
  const [price, setPrice] = useState<any>();
  const [launchActive, setLaunchActive] = useState<string>("NOW");
  const [inforErc20, setInforErc20] = useState<any>("");
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [isError, setIsError] = useState(false);
  const [isProcess, setIsProcess] = useState<boolean>(false);
  const [isTokenPayment, setIsTokenPayment] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const { account, updateAccount,wallet } = useContext(AccountContext);
  const handleDateChange = (date: Date | null) => {
    setStartDate(date);
    setLaunchActive("CUSTOM");
  };
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
    totalSale,
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
      const contractAddress = process.env.NEXT_PUBLIC_CREATOR || ""; // Creator
      const contract = new ethers.Contract(contractAddress, abiErc1155, signer);
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
      const checkAndLauchPadSubmit = async () => {
        const randomID = generateRandomNumber();
        const isExisting = await checkExists(randomID);
        if (isExisting) {
          checkAndLauchPadSubmit();
        } else {
          const startTimeTimestamp = startDate.getTime() / 1000;
          const endTimeTimestamp = endDate.getTime() / 1000;
          const transaction = await contract.launchpad_submit(
            randomID,
            initial,
            priceLauchpad,
            account,
            totalSupply,
            startTimeTimestamp,
            endTimeTimestamp,
            url,
            data
          );
          // await transaction.wait();
          transactionHash = transaction.hash;
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
  console.log(isProcess);
  console.log(account);

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
        "price",
        "totalSale",
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
          priceLauchpad,
          startDate,
          endDate,
          data: "0x",
          totalSale,
          url: await urlMetadata,
        });
      } else {
        setIsProcess(false);
      }
    } else {
      setIsOpen(true);
    }
  };
  console.log(isOpen);

  return (
    <div>
      <div>
        <label htmlFor="initial" className={styles.title}>
          <span className="">Initial</span>
          <span className="text-red">*</span>
        </label>
        <input
          placeholder="Initial"
          type="number"
          id="initial"
          value={initial || ""}
          className={
            emptyInputs.includes("initial")
              ? "w-full py-2 pl-2 mb-4 rounded-lg border-2 border-red"
              : styles.inputItem
          }
          onChange={(e) => setInitial(e.target.value)}
        />
        {emptyInputs.includes("initial") && (
          <p className="mb-2 ml-3 -mt-1 text-xs text-red" key="initial">
            Required
          </p>
        )}
      </div>
      <div>
        <label htmlFor="totalSale" className={styles.title}>
          <span className="">Total Sale</span>
          <span className="text-red">*</span>
        </label>
        <input
          placeholder="Total Sale"
          type="number"
          id="totalSale"
          value={totalSale || ""}
          className={
            emptyInputs.includes("totalSale")
              ? "w-full py-2 pl-2 mb-4 rounded-lg border-2 border-red"
              : styles.inputItem
          }
          onChange={(e) => setTotalSale(+e.target.value)}
        />
        {emptyInputs.includes("totalSale") && (
          <p className="mb-2 ml-3 -mt-1 text-xs text-red" key="totalSale">
            Required
          </p>
        )}
      </div>
      <div className="relative">
        <label htmlFor="tokenPayment" className={styles.title}>
          <span className="">Token Payment</span>
          <span className="text-red">*</span>
        </label>
        <input
          placeholder="0x3248"
          type="text"
          id="tokenPayment"
          value={tokenPayment || ""}
          className={
            emptyInputs.includes("tokenPayment")
              ? "w-full py-2 pl-2 mb-4 rounded-lg border-2 border-red"
              : styles.inputItem
          }
          onChange={handleTokenPaymentChange}
        />
        {isTokenPayment && (
          <div className="absolute top-[49%] right-2">
            <BiLoaderAlt className="animate-spin" />
          </div>
        )}
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
        <label htmlFor="price" className={styles.title}>
          <span className="">Price</span>
          <span className="text-red">*</span>
        </label>
        <input
          placeholder="1,000"
          type="number"
          id="price"
          value={price || ""}
          className={
            emptyInputs.includes("price")
              ? "w-full py-2 pl-2 mb-4 rounded-lg border-2 border-red"
              : styles.inputItem
          }
          onChange={(e) => setPrice(e.target.value)}
        />
        {emptyInputs.includes("price") && (
          <p className="mb-2 ml-3 -mt-1 text-xs text-red" key="price">
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
      <div className="relative">
        <div>
          <Button
            type="button"
            className="w-[140px] py-2"
            primary
            onClick={handleLauchpadSubmit}
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
