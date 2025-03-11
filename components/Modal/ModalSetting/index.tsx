import { NoteIcon } from "@/components/Icons";
import { TabGroups } from "@/components/NavChoice";
import AccountContext from "@/context/AccountContext";
import Tippy from "@tippyjs/react";
import { memo, useContext, useEffect, useState } from "react";
import { NumericFormat } from "react-number-format";

const ModalSetting = () => {
  const { updateSlippage, updateTxDeadline, txDeadline, slippage } =
    useContext(AccountContext);
  const [slippageTo, setSlippageTo] = useState<number>(20);
  const [time, setTime] = useState<number>(txDeadline);
  useEffect(() => {
    let storedSlippage = localStorage.getItem("SLIPPAGE_DEMASK");
    if (storedSlippage) {
      setSlippageTo(Number(storedSlippage));
    }
  }, [slippage]);
  useEffect(() => {
    const storedTime = localStorage.getItem("TXDEADLINE_DEMASK");
    if (storedTime) {
      setTime(Number(storedTime));
    }
  }, [txDeadline]);

  const Slippage = ["5%", "10%", "20%"];

  const handleChangeSlippage = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSlippageTo(Number(e.target.value));
    updateSlippage(Number(e.target.value));
  };
  const handleChoiceChange = (item: string) => {
    setSlippageTo(parseFloat(item));
    updateSlippage(parseFloat(item));
  };

  return (
    <div className="h-fit w-[360px] md:w-[403px] rounded-lg relative">
      <h2 className="flex items-center justify-between mb-3 text-xl font-semibold text-white title">
        Transaction Configurations
      </h2>
      <div className="text-shader_200">
        <div className="flex items-center my-2 gap-x-2">
          <h2 className="font-semibold ">Slippage Tolerance</h2>
          <Tippy
            interactive
            content={
              <span>
                Setting a high slippage tolerance can help transactions succeed,
                but you may not get such a good price. Use with caution.
              </span>
            }
          >
            <div>
              <NoteIcon width={14} height={14} />
            </div>
          </Tippy>
        </div>
        <div className="flex items-center justify-between w-full gap-x-2">
          <div className="rounded-lg border_500 bg-shader_600 text-white font-semibold">
            <input
              type="number"
              value={slippageTo}
              className="w-[60%] h-full py-[6px] mr-2 font-semibold bg-shader_600 outline-none pl-2"
              onChange={(e) => handleChangeSlippage(e)}
              onBlur={() => {
                if (slippageTo > 100) {
                  setSlippageTo(20);
                  updateSlippage(20);
                }
              }}
            />
            <span>%</span>
          </div>
          <TabGroups
            choices={Slippage}
            activeChoice={`${slippage}%`}
            onChoiceChange={handleChoiceChange}
          />
        </div>
        {(slippageTo > 20 || slippageTo === 0) && (
          <p className="mt-2 mb-2 text-xs text-yellow" key="NFTbalance">
            Your transaction may be frontrun
          </p>
        )}
        <div className="flex items-center my-2 gap-x-2">
          <h2 className="font-semibold ">Tx deadline (mins)</h2>
          <Tippy
            interactive
            content={
              <span>
                Your transaction will revert if it is left confirming for longer
                than this time.
              </span>
            }
          >
            <div>
              <NoteIcon width={14} height={14} />
            </div>
          </Tippy>
        </div>
        <NumericFormat
          pattern="^[0-9]+$"
          value={time}
          thousandSeparator=","
          decimalScale={0}
          className="input_item"
          onChange={(e) => {
            const inputValue = Number(e.target.value.replace(/,/g, ""));
            setTime(inputValue);
            updateTxDeadline(inputValue);
          }}
          onBlur={() => {
            if (time < 20) {
              setTime(20);
              updateTxDeadline(20);
            }
          }}
          onKeyDown={(event) => {
            if (
              !(event.key >= "0" && event.key <= "9") &&
              event.key !== "Backspace" &&
              event.key !== "ArrowLeft" &&
              event.key !== "ArrowRight"
            ) {
              event.preventDefault();
            }
          }}
        />
      </div>
    </div>
  );
};

export default memo(ModalSetting);
