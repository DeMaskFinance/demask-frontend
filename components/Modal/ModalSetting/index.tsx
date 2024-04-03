import { TokenIconNotDefine } from "@/components/Icons";
import { memo, useContext, useEffect, useState } from "react";
import { CgClose } from "react-icons/cg";
import "react-toastify/dist/ReactToastify.css";
import Wrapper from "../Wrapper";
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import { Button } from "@/components/Buttons";
import AccountContext from "@/context/AccountContext";
interface ModalSettingProps {
    isOpenSetting: boolean;
    setIsOpenSetting: React.Dispatch<React.SetStateAction<boolean>>;
}
const styles = {
    title: "block mb-4 text-base font-medium text-black24",
    inputItem: "w-12 p-2 mb-4 border rounded-xl border-dark3",
};
const ModalSetting: React.FunctionComponent<
    ModalSettingProps
> = ({
    isOpenSetting,
    setIsOpenSetting,
}) => {

        const { updateSlippage, updateTxDeadline, txDeadline, slippage } = useContext(AccountContext);
        const [slippageTo, setSlippageTo] = useState<number>(0.5);
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

        const Slippage = [
            0.1, 0.5, 1
        ]
        const handleClose = (e: React.MouseEvent<HTMLDivElement> | React.MouseEvent<HTMLButtonElement>) => {
            e.preventDefault();
            document.body.style.overflowY = "auto";
            setIsOpenSetting(false);
        };

        const handleChangeSlippage = (e: React.ChangeEvent<HTMLInputElement>) => {
            setSlippageTo(Number(e.target.value));
            updateSlippage(Number(e.target.value));
        }

        return (
            <Wrapper isOpen={isOpenSetting} onClick={handleClose}>
                <div className="container_modal">
                    <div className="bg-white h-fit w-[360px] md:w-[400px] lg:w-[480px] rounded-lg p-4 relative">
                        <h2 className="flex items-center mb-3 text-xl font-semibold text-dark1">
                            Settings swap & liquidity
                        </h2>
                        <div className="flex flex-col items-center">
                            <div className="flex items-center my-2 gap-x-2">
                                <h2 className="font-semibold text-dark2">Slippage Tolerance</h2>
                                <Tippy interactive content={<span>Setting a high slippage tolerance can help transactions succeed, but you may not get such a good price. Use with caution.</span>}>
                                    <div>
                                        <TokenIconNotDefine width={16} height={16} />
                                    </div>
                                </Tippy>
                            </div>
                            <div className="flex">
                                {Slippage.map((item, index) => (
                                    <Button key={index} className='w-10 py-2 mr-2 font-semibold border border-dark4 text-dark3' onClick={() => {
                                        setSlippageTo(item)
                                        updateSlippage(item)
                                    }}>{item}</Button>
                                ))}
                                <input type="number" value={slippageTo} className='w-10 text-center justify-center h-full pb-2 pt-[6px] mr-2 font-semibold border rounded-lg border-dark4 text-dark3'
                                    onChange={(e) => handleChangeSlippage(e)}
                                    onBlur={() => {
                                        if (slippageTo > 100) {
                                            setSlippageTo(0.5);
                                            updateSlippage(0.5);
                                        }
                                    }}
                                />
                                <span>%</span>
                            </div>
                            {(slippageTo > 5 || slippageTo === 0) && (
                                <p
                                    className="mt-2 mb-2 text-xs text-yellow"
                                    key="NFTbalance"
                                >
                                    Your transaction may be frontrun
                                </p>
                            )}
                            <div className="flex items-center my-2 gap-x-2">
                                <h2 className="font-semibold text-dark1">Tx deadline (mins)
                                </h2>
                                <Tippy interactive content={<span>Your transaction will revert if it is left confirming for longer than this time.</span>}>
                                    <div>
                                        <TokenIconNotDefine width={16} height={16} />
                                    </div>
                                </Tippy>
                            </div>
                            <input
                                pattern="^[0-9]+$"
                                value={time}
                                type="number"
                                className='w-1/2 p-2 mb-4 text-center border rounded-xl border-dark4'
                                onChange={(e) => {
                                    const inputValue = Number(e.target.value);
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
                                    if (!(event.key >= '0' && event.key <= '9') && event.key !== 'Backspace' && event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') {
                                        event.preventDefault();
                                    }
                                }}
                            />
                        </div>
                    </div>
                    <button
                        className="absolute top-0 right-0 p-2 text-lg"
                        onClick={handleClose}
                    >
                        <CgClose className="text-xl transition-colors duration-100 ease-linear hover:text-red" />
                    </button>
                </div>
            </Wrapper>
        );
    };

export default memo(ModalSetting);
