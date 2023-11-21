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
        const [slippageTo, setSlippageTo] = useState<number>(3);
        const [time, setTime] = useState<number>(txDeadline);
        useEffect(() => {
            let storedSlippage = localStorage.getItem("SLIPPAGE_DEMASK");
            console.log(storedSlippage);
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
        const handleClose = (e: any) => {
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
                <div className="relative z-50 flex flex-col justify-center cursor-default h-fit">
                    <div className="bg-white h-fit w-[360px] md:w-[400px] lg:w-[480px] rounded-lg p-4 relative">
                        <h2 className="flex items-center mb-3 text-xl font-semibold text-dark1">
                            Settings
                        </h2>
                        <h2 className="text-lg font-semibold">SWAPS & LIQUIDITY</h2>
                        <div className="flex items-center my-2 gap-x-2">
                            <h2 className="font-semibold text-dark1">Slippage Tolerance</h2>
                            <Tippy interactive content={<span>Setting a high slippage tolerance can help transactions succeed, but you may not get such a good price. Use with caution.</span>}>
                                <div>
                                    <TokenIconNotDefine width={16} height={16} />
                                </div>
                            </Tippy>
                        </div>
                        <div>
                            {Slippage.map((item, index) => (
                                <Button key={index} primary className='w-10 py-1 mr-2' onClick={() => {
                                    setSlippageTo(item)
                                    updateSlippage(item)
                                }}>{item}</Button>
                            ))}
                            <input type="text" value={slippageTo} className='w-10 p-1 mr-2 border rounded-xl border-dark3' 
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
                            type="text"
                            className={styles.inputItem}
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
                        />
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
