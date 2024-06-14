import MediaNFT from "@/components/Common/MediaNFT";
import { EtherIcon, LoadingIcon } from "@/components/Icons";
import ModalNumber from "@/components/Modal/ModalLength/ModalNumber";
import AccountContext from "@/context/AccountContext";
import Image from "next/image";
import Link from "next/link";
import React, { useContext } from "react";
interface TransactionItemProps {
  data: any;
  isFetching: boolean;
  isLoading: boolean;
}

const skeleton = (
  <div className="w-[100%] h-8 bg-slate-700 animate-pulse mr-2 rounded-xl" />
);
const TransactionItem: React.FC<TransactionItemProps> = ({
  data,
  isFetching,
  isLoading,
}) => {
  const { demask, chainId } = useContext(AccountContext);

  return (
    <>
      {isLoading || isFetching ? (
        <div className="w-full h-full flex-auto justify-center items-center flex">
          <LoadingIcon width={30} height={30} className="animate-spin" />
        </div>
      ) : (
        <>
          {data?.data.map((item: any, idx: number) => (
            <tr
              key={idx}
              className="flex px-4 text-sm font-semibold text-white hover:cursor-pointer group hover:bg-shader_500 border-y border-shader_500"
            >
              <td className="py-2 hover:text-secondary3 relative flex items-center justify-start lg:w-full md:w-full w-[200px]">
                <Link
                  target="_blank"
                  href={`${demask.urltxHash}tx/${item.transactionHash}`}
                  className="relative group"
                >
                  <span className="flex items-center gap-x-2">
                    <span className="flex-shrink-0 block">
                      <div className="flex-shrink-0 rounded-md overflow-hidden w-[32px] h-[32px] flex items-center">
                        <MediaNFT data={item} isControls={false} />
                      </div>
                    </span>
                    <span className="line-clamp-1 truncate  max-w-[133px] block">
                      {isFetching ? skeleton : item.metadata?.name}
                    </span>
                  </span>
                </Link>
              </td>
              <td className="py-2 flex items-center justify-end lg:w-full md:w-full w-[140px] ">
                <span
                  className={` border text-xs ml-3 text-center bg-opacity-10 w-16 ${
                    item.action === "Buy" || item.action === "Add"
                      ? "border-green text-green bg-green"
                      : "border-red text-red bg-red"
                  } p-1 rounded-lg`}
                >
                  {isFetching ? skeleton : item.action}
                </span>
              </td>
              <td className="py-2 flex items-center justify-end lg:w-full md:w-full w-[140px] ">
                <span className="">
                  {isFetching ? (
                    skeleton
                  ) : (
                    <p>{Number(item.amountNFT).toLocaleString()}</p>
                  )}
                </span>
              </td>

              <td className="py-2 flex items-center justify-end lg:w-full md:w-full w-[140px]">
                <span className="">
                  {isFetching ? (
                    skeleton
                  ) : (
                    <div className="flex gap-x-1">
                      <ModalNumber data={item.amountToken} />
                      <p>
                        <EtherIcon
                          width={18}
                          height={18}
                          className="fill-dark2"
                        />
                      </p>
                    </div>
                  )}
                </span>
              </td>
              <td className="py-2 flex items-center justify-end lg:w-full md:w-full w-[140px]">
                <a
                  href={`${demask.urltxHash}address/${item.sender}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-secondary5"
                >
                  {isFetching
                    ? skeleton
                    : item.sender.slice(0, 4) + "..." + item.sender.slice(-4)}
                </a>
              </td>

              <td className="py-2 flex items-center justify-end lg:w-full md:w-full w-[140px]">
                {isFetching ? skeleton : item.blockTime}
              </td>
            </tr>
          ))}
        </>
      )}
    </>
  );
};

export default TransactionItem;
