import React from "react";
import { MinusIcon, PlusIcon } from "../Icons";
import { NumericFormat } from "react-number-format";

const InputCount = () => {
  return (
    <div className="flex h-10 items-center  transition-all duration-200 font-normal text-white   bg-shader_600 outline-none border-shader_400 border rounded-lg">
      <div className="w-10 flex justify-center">
        <MinusIcon />
      </div>
      <NumericFormat
        name="amountNFT"
        id="amountNFT"
        autoComplete="off"
        placeholder="0"
        pattern="^[1-9][0-9]*$"
        decimalScale={0}
        decimalSeparator=","
        thousandSeparator="."
        className=" h-full px-3 outline-none placeholder:text-shader_300 bg-shader_600 border-x border-shader_400 font-bold w-24"
        // value={inputNFT}
        // onValueChange={handleGetNFT}
      />
      <div className="w-10 flex justify-center">
        <PlusIcon width={16} height={16} className="text-primary_400" />
      </div>
    </div>
  );
};

export default InputCount;
