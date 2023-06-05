import React, { useState } from "react";
import Button from "../Buttons/Button";
import { mintNFT, uploadFileToIPFS } from "@/libs/nftCreatorUtils";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const styles = {
  title: "block mb-4 text-base font-semibold text-black24",
  inputItem: "w-full py-2 pl-2 mb-4 border rounded-lg border-dark2",
  btnActive: "rounded-full bg-base2",
};
export default function MintNFT({
  name,
  symbol,
  attributeItems,
  description,
  fileIPFS,
  selectedCategory,
  setEmptyInputs,
  emptyInputs
}: any) {
  const [totalSupply, setTotalSupply] = useState<number>();
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const emptyInputFields = [];
    if (name === "") {
      emptyInputFields.push("name");
    }

    if (symbol === "") {
      emptyInputFields.push("symbol");
    }
    if (totalSupply === undefined){
        emptyInputFields.push("totalSupply");
    }
    if (fileIPFS === null){
        emptyInputFields.push("fileIPFS");
        toast.error('File not found.Try again!', {
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
      mintNFT({
        amount: Number(totalSupply),
        data: "0x",
        url: urlMetadata,
      });
    }
  };
  return (
    <div className="w-[200px]">
      <label htmlFor="totalSupply" className={styles.title}>
        <span>Total Supply</span>
        <span className="text-red">*</span>
      </label>

      <input
        placeholder="10,000"
        type="number"
        id="totalSupply"
        value={totalSupply || ''}
        className={
            emptyInputs.includes("totalSupply")
              ? "w-full py-2 pl-2 mb-4 rounded-lg border-2 border-red"
              : styles.inputItem
          }
        onChange={(e) => setTotalSupply(Number(e.target.value))}
      />
      {emptyInputs.includes("totalSupply") && (
                <p className="mb-2 ml-3 -mt-1 text-xs text-red" key="initial">
                  Required
                </p>
              )}
      <Button className="px-4 py-1" onClick={handleSubmit}>
        CREATE
      </Button>
      <ToastContainer />
    </div>
  );
}
