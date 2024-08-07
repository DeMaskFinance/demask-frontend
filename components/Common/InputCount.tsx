import React from "react";
import { MinusIcon, PlusIcon } from "../Icons";
import { NumberFormatValues, NumericFormat } from "react-number-format";
import { replaceDot } from "@/libs/utils/formatComon";
interface InputCountProps {
  inputAmount: number;
  setInputAmount: React.Dispatch<React.SetStateAction<number>>;
}
const InputCount: React.FC<InputCountProps> = ({
  inputAmount,
  setInputAmount,
}) => {
  const handleChange = (values: NumberFormatValues) => {
    const { value } = values;
    const inputValue = replaceDot(value);
    setInputAmount(+inputValue);
  };
  return (
    <div className="flex h-10 items-center  transition-all duration-200 font-normal text-white   bg-shader_600 outline-none border-shader_400 border rounded-lg">
      <div
        className="w-10 flex justify-center cursor-pointer"
        onClick={() => {
          if (inputAmount > 1) {
            setInputAmount(inputAmount - 1);
          }
        }}
      >
        <MinusIcon />
      </div>
      <NumericFormat
        name="amount"
        id="amount"
        autoComplete="off"
        placeholder="0"
        pattern="^[1-9][0-9]*$"
        decimalScale={0}
        decimalSeparator=","
        thousandSeparator="."
        className=" h-full px-3 outline-none placeholder:text-shader_300 bg-shader_600 border-x border-shader_400 font-bold w-24 text-center"
        value={inputAmount}
        onValueChange={handleChange}
      />
      <div
        className="w-10 flex justify-center cursor-pointer"
        onClick={() => {
          setInputAmount(inputAmount + 1);
        }}
      >
        <PlusIcon width={16} height={16} className="text-primary_400" />
      </div>
    </div>
  );
};

export default InputCount;
