import CountdownTime from "@/components/Common/CountdownTime";
import ModalLaunchPadProfile from "@/components/Modal/ModalLaunchpadProfile";
import { ModalTransation } from "@/components/Modal/ModalTransation";
import AccountContext from "@/context/AccountContext";
import { convertTime } from "@/hooks/useConvertTime";
import handleLeaveLaunchPad from "@/libs/utils/handleLeaveLaunchpad";
import handleReleaseLaunchPad from "@/libs/utils/handleReleaseLaunchPad";
import Image from "next/image";
import Link from "next/link";
import React, { useContext, useEffect, useState } from "react";
import { BiLoader } from "react-icons/bi";
import { IoReloadOutline } from "react-icons/io5";
export default function CardLaunchpad({
  tab,
  data,
  refetch,
  isRefetching,
  isLoading,
}: any) {
  const { account, wallet, chainId, demask, tokenDefault } =
    useContext(AccountContext);

  const [isOpenTransaction, setIsOpenTransaction] = useState<boolean>(false);
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
  const [amount, setAmount] = useState(0);
  const [amountLeave, setAmountLeave] = useState(0);
  const [tokenLaunchpad, setTokenLaunchpad] = useState("");

  return (
    <>
      <div className="flex items-center justify-between pb-4">
        <h2 className="flex items-baseline">
          Total (
          {!isLoading ? (
            data?.data.length
          ) : (
            <BiLoader className="animate-spin" />
          )}
          )
        </h2>

        <button
          onClick={() => {
            refetch();
          }}
          className="flex items-center gap-2 px-2 py-1 text-white border rounded-lg bg-secondary3 hover:bg-secondary5"
        >
          <IoReloadOutline /> Refetch
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 overflow-hidden lg:grid-cols-3 md:grid-cols-2">
        {data?.data?.map((item: any,index:number) => (
          <div key={index}>
            {
              <div className="relative max-w-sm overflow-hidden bg-gray-800 rounded-b-lg">
                <Link
                  className="overflow-hidden transition-all h-52 group"
                  href={`launchpad/${item.nftID}/${process.env.NEXT_PUBLIC_CREATOR}/${item.tokenPayment}`}
                >
                  <Image
                    className="relative z-0 object-cover w-full transition-all scale-105 h-52 group-hover:scale-110"
                    src={item.metadata.image}
                    alt=""
                    width={600}
                    height={600}
                  />
                </Link>
                <div className="relative z-40 flex items-center justify-between px-5 pt-4 pb-2 overflow-hidden">
                  <Link
                    href={`launchpad/${item.nftID}/${process.env.NEXT_PUBLIC_CREATOR}/${item.tokenPayment}`}
                  >
                    <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 hover:text-secondary5 dark:text-white">
                      {item.metadata.name}
                    </h5>
                  </Link>
                </div>
                <CountdownTime blockNumber={item.endTime} />
                <div className="flex justify-between px-5 pb-4">
                  <button
                    disabled={item.status === null ? true : item.status}
                    className={`${item.status === null || item.status
                      ? "text-slate-400 border-slate-400 border"
                      : "text-red border border-red hover:border-secondary5 hover:text-secondary5"
                      }  px-2 py-1 rounded-lg transition-all`}
                    onClick={() => {
                      setIsOpenModal(true);
                      setAmount(item?.amount);
                      setAmountLeave(item?.amount);
                      setTokenLaunchpad(item?.launchpad);
                    }}
                  >
                    Leave
                  </button>
                  <button
                    // disabled={item.status === null ? true : !item.status}
                    className={`border ${!item.status
                      ? "text-slate-400 border-slate-400 border"
                      : "border-green hover:border-secondary5 hover:text-secondary5 text-green"
                      }   px-2 py-1 rounded-lg transition-all`}
                    onClick={() => {
                      handleReleaseLaunchPad(
                        account,
                        wallet,
                        item.launchpad,
                        setIsOpenModal,
                        setIsOpenTransaction
                      );
                    }}
                  >
                    Release
                  </button>
                </div>
                <span className="text-white absolute top-0 min-w-[32px] text-center text-sm block bg-secondary4 px-2 py-2 rounded-b-full">
                  {isRefetching ? (
                    <BiLoader className="animate-spin" />
                  ) : (
                    item.amount
                  )}
                </span>
              </div>
            }
          </div>
        ))}
      </div>
      <ModalTransation
        isOpenTransation={isOpenTransaction}
        setIsOpenTransaction={setIsOpenTransaction}
        isTransaction={true}
      />
      <ModalLaunchPadProfile
        isOpenModal={isOpenModal}
        setIsOpenModal={setIsOpenModal}
        isOpenTransation={isOpenTransaction}
        setIsOpenTransaction={setIsOpenTransaction}
        amount={amount}
        setAmount={setAmount}
        setAmountLeave={setAmountLeave}
        amountLeave={amountLeave}
        tokenLaunchpad={tokenLaunchpad}
        refetch={refetch}
      />
    </>
  );
}
