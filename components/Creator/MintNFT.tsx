import React, { useState, useEffect, useContext } from "react";
import Button from "../Buttons/Button";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ethers } from "ethers";
import abiDemask from "@/abi/abiCreator.json";
import TransitionURL from "../Toast/TransionURL";
import { Processing } from "../Loading";
import getMetadataUrl from "@/libs/utils/getMetadata";
import { getProvider } from "@/libs/connection/getProvider";
import { ModalWallet } from "../Modal/ModalWallet";
import AccountContext from "@/context/AccountContext";
import { checkNetwork } from "@/libs/validation";
import { changeNetwork } from "@/libs/utils/changeNetwork";
import { exponentialToDecimal } from "@/libs/utils/convertExponential";
import { usePreventUserFromErasingContent } from "@/hooks/usePreventUserFromErasingContent";
const styles = {
  title: "block mb-4 text-base font-semibold text-black24",
  inputItem: "w-[200px] py-2 pl-2 mb-4 border rounded-lg border-dark3",
  btnActive: "rounded-full bg-base2",
};
interface mintProps {
  amount: number;
  data: string;
  url: any;
  feeRoyal: number;
}

export default function MintNFT({
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
  setFileIPFS,
  setAttributeItems,
  setDescription,
  setSymbol,
  setSelectedFile,
  fileType,
}: any) {
  const [totalSupply, setTotalSupply] = useState<number | null>();
  const [royaltiesFee, setRoyaltiesFee] = useState<number | null>();
  const [isProcess, setIsProcess] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [validFee, setValidFee] = useState<boolean>(false);
  const [checkExit, setCheckExit] = useState<boolean>(false);
  const { account, updateAccount, wallet, demask, chainId } = useContext(AccountContext);
  const contractAddress = demask.CREATOR; // Creator
  console.log(fileIPFS);
  useEffect(() => {
    if (name || symbol || description || fileIPFS || totalSupply || royaltiesFee) {
      setCheckExit(true)
    } else {
      setCheckExit(false)
    }
  }, [name, symbol, description, fileIPFS, totalSupply, royaltiesFee])
  console.log(checkExit);
  console.log(name, symbol, attributeItems, description, fileIPFS, totalSupply, royaltiesFee);
  
  usePreventUserFromErasingContent(checkExit);
  async function mintNFT({ amount, data, url, feeRoyal }: mintProps) {
    const ethereum = (window as any).ethereum;
    let transactionHash = "";
    if (typeof ethereum === "undefined") {
      alert("Please install Wallet to mint NFTs.");
      return;
    }

    try {
      const providerChoice = getProvider(wallet);
      const provider = new ethers.providers.Web3Provider(providerChoice);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(contractAddress, abiDemask, signer);
      console.log(contract);

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
      const checkAndMint = async () => {
        const randomID = generateRandomNumber();
        const isExisting = await checkExists(randomID);
        if (isExisting) {
          checkAndMint();
        } else {
          console.log(feeRoyal);

          const tx = await contract.mint(account, randomID, exponentialToDecimal(amount), exponentialToDecimal(feeRoyal * 100), data, url);
          transactionHash = tx.hash;
          console.log(transactionHash);
          const check = await provider.waitForTransaction(transactionHash);
          if (check.status === 1) {
            toast.success(
              <TransitionURL type={"Mint success"} transactionHash={transactionHash} />,
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
              <TransitionURL type={"Mint failed"} transactionHash={transactionHash} />,
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

          setTotalSupply(null);
          setName("");
          setDescription("");
          setSymbol("");
          setAttributeItems([{ id: 0, trait_type: "", value: "" }]);
          setSelectedCategory([]);
          setSelectedFile(null);
          setFileIPFS(null);
          setRoyaltiesFee(null)
        }
      };
      await checkAndMint();
    } catch (error) {
      console.error("Failed to mint NFT:", error);
    }
    setIsProcess(false);
  }
  console.log(isProcess);

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    if (account) {
      setIsProcess(true);
      const emptyInputFields = [];
      if (name === "") {
        emptyInputFields.push("name");
      }

      if (symbol === "") {
        emptyInputFields.push("symbol");
      }
      if (totalSupply === undefined) {
        emptyInputFields.push("totalSupply");
      }
      if (royaltiesFee === undefined) {
        emptyInputFields.push("royaltiesFee");
      }
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
        mintNFT({
          amount: Number(totalSupply),
          data: "0x",
          url: await urlMetadata,
          feeRoyal: Number(royaltiesFee),
        });
      } else {
        setIsProcess(false);
      }
    } else {
      setIsOpen(true);
      document.body.style.overflowY = "hidden";
    }
  };
  console.log(isProcess);
  const handleChangeRoyalFee = (e: any) => {
    setRoyaltiesFee(Number(e.target.value))
    if (e.target.value < 0 || e.target.value > 100) {
      setValidFee(true);
    } else {
      setValidFee(false);
    }
  }
  console.log(royaltiesFee);
  console.log(validFee);

  return (
    <div className="">
      <label htmlFor="totalSupply" className={styles.title}>
        <span>Total Supply</span>
        <span className="text-red">*</span>
      </label>

      <input
        placeholder="10,000"
        type="number"
        id="totalSupply"
        autoComplete="off"
        value={totalSupply || ""}
        className={
          emptyInputs.includes("totalSupply")
            ? "w-[200px] py-2 pl-2 mb-4 rounded-lg border-2 border-red"
            : styles.inputItem
        }
        onChange={(e) => setTotalSupply(Number(e.target.value))}
      />
      {emptyInputs.includes("totalSupply") && (
        <p className="mb-2 ml-3 -mt-1 text-xs text-red" key="initial">
          Required
        </p>
      )}
      <label htmlFor="royaltiesFee" className={styles.title}>
        <span>Royalties Fee</span>
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
      <div className="relative">
        <div>
          <Button
            type="button"
            className="w-[140px] py-2"
            primary
            onClick={handleSubmit}
          >
            CREATE
          </Button>
          {isProcess && <Processing />}
        </div>
        <ModalWallet isOpen={isOpen} setIsOpen={setIsOpen} />
      </div>
    </div>
  );
}
