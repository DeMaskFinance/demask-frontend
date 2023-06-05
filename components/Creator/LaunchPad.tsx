import { useState, useRef } from "react";
import setHours from "date-fns/setHours";
import setMinutes from "date-fns/setMinutes";
import DatePicker from "react-datepicker";
import Button from "../Buttons/Button";
import { launchPadSubmit } from "@/libs/launchPadSubmit";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { uploadFileToIPFS } from "@/libs/nftCreatorUtils";
import { startOfMinute } from "date-fns";

interface LauchPadProps {
  name: string;
  symbol: string;
  attributeItems: object[];
  description: string;
  fileIPFS: any;
  selectedCategory: string[];
  setEmptyInputs: React.Dispatch<React.SetStateAction<string[]>>;
  emptyInputs: string[];
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
}: any) => {
  const currentDate = new Date();
  const utcHours = currentDate.getUTCHours();
  const utcMinutes = currentDate.getUTCMinutes();
  const datePickerRef = useRef<any>(null);
  const [initial, setInitial] = useState<number>();
  const [totalSale, setTotalSale] = useState<number>();
  const [tokenPayment, setTokenPayment] = useState<string>("");
  const [price, setPrice] = useState<number>();
  const [launchActive, setLaunchActive] = useState<string>("NOW");
  const [startDate, setStartDate] = useState<any>(
    setHours(setMinutes(new Date(), utcMinutes), utcHours)
  );
  const changeLaunchStart = (option: string) => {
    setLaunchActive(option);
    if (option === "NOW") {
      setStartDate(
        setHours(
          setMinutes(new Date(), new Date().getMinutes()),
          new Date().getHours()
        )
      );
    }
  };
  const handleDateChange = (date: any) => {
    setStartDate(date);
    setLaunchActive("CUSTOM");
  };
  const handleLauchpadSubmit = async () => {
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

    setEmptyInputs(emptyInputFields);
    if (emptyInputFields.length === 0) {
      const simplifiedAttributes = attributeItems.map(
        ({ trait_type, value }:any) => ({ trait_type, value })
      );
      const metadata = JSON.stringify({
        name: name,
        symbol: symbol,
        description: description,
        image: await fileIPFS,
        attributes: simplifiedAttributes,
        category: selectedCategory,
      });
      const urlMetadata = await uploadFileToIPFS(metadata);
      launchPadSubmit({
        initial,price,startDate,fileIPFS,data:'0x',totalSale,url:urlMetadata
      })
    }
  };
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
          value={initial}
          className={
            emptyInputs.includes("initial")
              ? "w-full py-2 pl-2 mb-4 rounded-lg border-2 border-red"
              : styles.inputItem
          }
          onChange={(e) => setInitial(+e.target.value)}
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
          value={totalSale}
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
      <div>
        <label htmlFor="tokenPayment" className={styles.title}>
          <span className="">Token Payment</span>
          <span className="text-red">*</span>
        </label>
        <input
          placeholder="0x3248"
          type="text"
          id="tokenPayment"
          value={tokenPayment}
          className={
            emptyInputs.includes("tokenPayment")
              ? "w-full py-2 pl-2 mb-4 rounded-lg border-2 border-red"
              : styles.inputItem
          }
          onChange={(e) => setTokenPayment(e.target.value)}
        />
        {emptyInputs.includes("totalSale") && (
          <p className="mb-2 ml-3 -mt-1 text-xs text-red" key="totalSale">
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
          value={price}
          className={
            emptyInputs.includes("price")
              ? "w-full py-2 pl-2 mb-4 rounded-lg border-2 border-red"
              : styles.inputItem
          }
          onChange={(e) => setPrice(Number(e.target.value))}
        />
      </div>
      <div>
        <p className={styles.title}>Launchpad start</p>
        <div className="grid h-[34px] grid-cols-2 rounded-full w-[120px] mb-4 text-sm bg-dark2 text-white">
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
        </div>
        <div className="w-full mb-4 border rounded-lg border-dark2">
          <DatePicker
            selected={startDate}
            onChange={handleDateChange}
            minDate={new Date()}
            timeIntervals={5}
            showTimeSelect
            excludeTimes={[]}
            dateFormat="MMMM d, yyyy h:mm aa"
            className="w-full h-full py-3 pl-2 border-none rounded-lg text-customDate"
            ref={datePickerRef}
          />
        </div>
      </div>
      <div>
        <p className={styles.title}>Launchpad end</p>
        <div className="w-full mb-4 border rounded-lg border-dark2">
          <DatePicker
            selected={startDate}
            onChange={handleDateChange}
            showTimeSelect
            excludeTimes={[]}
            dateFormat="MMMM d, yyyy h:mm aa"
            className="w-full h-full py-3 pl-2 border-none rounded-lg text-customDate"
            ref={datePickerRef}
          />
        </div>
      </div>
      <Button
        type="button"
        className="px-4 py-1"
        onClick={handleLauchpadSubmit}
      >
        CREATE
      </Button>
      <ToastContainer />
    </div>
  );
};

export default LauchPad;
