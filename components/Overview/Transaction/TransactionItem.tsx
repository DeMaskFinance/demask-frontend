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
  <div className="w-[100%] h-8 bg-slate-200 animate-pulse mr-2 rounded-xl" />
);
const TransactionItem: React.FC<TransactionItemProps> = ({
  data,
  isFetching,
  isLoading,
}) => {
  const { demask } = useContext(AccountContext);
  return (
    <>
      {isLoading || isFetching ? (
        Array.from({ length: 10 }, (item, index) => (
          <tr key={index} className="flex text-sm lg:text-base md:text-base text-dark2">
            <td className="py-2 flex items-center justify-start lg:w-[440px] md:w-[340px] w-[50px]">
              {skeleton}
            </td>
            <td className="py-2 flex items-center justify-start lg:w-full md:w-full w-[200px]">
              {skeleton}
            </td>
            <td className="py-2 flex items-center justify-end lg:w-full md:w-full w-[140px]">
              {skeleton}
            </td>
            <td className="py-2 flex items-center justify-end lg:w-full md:w-full w-[140px]">
              {skeleton}
            </td>
            <td className="py-2 flex items-center justify-end lg:w-full md:w-full w-[140px]">
              {skeleton}
            </td>
            <td className="py-2 flex items-center justify-end lg:w-full md:w-full w-[140px]">
              {skeleton}
            </td>
          </tr>
        ))
      ) : (
        <>
          {data?.data.map((item: any, idx: number) => (
            <tr key={idx} className="flex text-sm border-b rounded-lg lg:text-base md:text-base text-dark2 hover:bg-slate-100 lg:px-2">
              <td className="py-2 flex items-center justify-start lg:w-[440px] md:w-[340px] w-[50px]">
                {(data.currentPage - 1) * 10 + (idx + 1)}
              </td>
              <td className="py-2 hover:text-secondary3 relative flex items-center justify-start lg:w-full md:w-full w-[200px]">
                <Link
                  target="_blank"
                  href={`${demask.urltxHash}${item.transactionHash}`}
                  className="relative group"
                >
                  <span className="flex items-center gap-x-2">
                    <span className="flex-shrink-0 block">
                      <div className="flex-shrink-0 rounded-md overflow-hidden w-[32px] h-[32px] flex items-center">
                        {item.metadata?.image && (
                          <Image
                            loading="lazy"
                            width={32}
                            height={32}
                            src={item.metadata?.image}
                            alt="NFT Image"
                            className="object-cover w-full h-full"
                          />
                        )}
                        {item.metadata?.animation_url &&
                          !item.metadata?.image && (
                            <video
                              src={item.metadata?.animation_url}
                              autoPlay={false}
                              loop
                              muted
                              className="object-cover h-full"
                            />
                          )}
                        {item.metadata?.image &&
                          item.metadata?.animation_url && (
                            <audio
                              autoPlay
                              loop
                              muted
                              controls
                              src={item.metadata?.animation_url}
                              className=""
                            >
                              Your browser does not support the
                              <code>audio</code> element.
                            </audio>
                          )}
                      </div>
                    </span>
                    <span className="line-clamp-1 truncate lg:group-hover:hidden max-w-[133px] block">
                      {isFetching ? skeleton : item.metadata?.name}
                    </span>
                    <span
                      className={`ml-5 absolute top-0 left-48 bg-transparent border text-sm ${item.action === "Buy" || item.action === "Add"
                        ? "border-green text-green"
                        : "border-red text-red"
                        } p-1 rounded-lg`}
                    >
                      {isFetching ? skeleton : item.action}
                    </span>
                  </span>

                  <p className="absolute top-0 hidden px-2 py-1 whitespace-pre bg-white border rounded-lg w-fit left-10 lg:group-hover:block sub-title">
                    {item.metadata?.name}
                  </p>
                </Link>
              </td>

              <td className="py-2 flex items-center justify-end lg:w-full md:w-full w-[140px] ">
                <span className="">
                  {isFetching ? skeleton : <ModalNumber data={item.amountnft} />}
                </span>
              </td>

              <td className="py-2 flex items-center justify-end lg:w-full md:w-full w-[140px]">
                <span className="">
                  {isFetching ? skeleton : (
                    <div className="flex gap-x-1">
                      <ModalNumber data={item.amounttokenInUSD} />
                      {item.tokenSymbol === 'WETH' ? (
                        <span>MATIC</span>
                      ) : (
                        <span>{item.tokenSymbol}</span>
                      )}
                    </div>
                  )}
                </span>
              </td>
              <td className="py-2 flex items-center justify-end lg:w-full md:w-full w-[140px]">
                <span className="">
                  {isFetching
                    ? skeleton
                    : item.sender.slice(0, 4) + "..." + item.sender.slice(-4)}
                </span>
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
