import Image from "next/image";
import React, { Fragment } from "react";
import { EtherIcon, RankIcon } from "../Icons";
import FormatNumber from "../Common/FormatNumber";
import { AvatarCustom, AvatarUser } from "../Avatars";
import { formatToUnit } from "@/libs/utils/formatComon";
export const CardListLoading = () => {
  return (
    <div className="flex animate-pulse flex-col items-center justify-center p-2 border rounded-lg text-dark1 mb-10 h-fit border-secondary5 shadow-[0px_8px_24px_0px_rgba(29,133,232,0.25)]">
      <div className="w-[80px] h-[80px] rounded-full bg-slate-200 dark:bg-slate-700" />
      <div className="mt-2 mb-6 text-2xl font-semibold">
        <div className="w-20 h-4 rounded bg-slate-200 dark:bg-slate-700"></div>
      </div>

      <div className="bg-[#F8F8F8] rounded-lg w-full flex flex-col items-center pt-6 pb-2 relative">
        <div className="absolute p-2 bg-white rounded-full -top-4 shadow-swiper w-fit">
          <RankIcon width={24} height={24} className="fill-[#1D85E8]" />
        </div>
        <div className="pb-2 font-semibold border-b border-dark1 w-[60%] text-center">
          <div className="h-4 rounded-full bg-slate-200 dark:bg-slate-700"></div>
        </div>
        <div className="flex my-2 text-sm font-semibold">
          <div className="w-20 h-4 rounded-full bg-slate-200 dark:bg-slate-700"></div>
        </div>
        <p className="text-xs font-medium whitespace-nowrap">Season Volume</p>
      </div>
    </div>
  );
};
const CardList = ({ data }: any) => {
  return (
    <div
      className={`flex flex-col bg-white dark:bg-darkBG1 items-center justify-center p-2 border dark:text-white rounded-lg text-dark1 w-full h-fit ${
        data?.rank === 1
          ? "border-yellow shadow-[0px_0px_24px_6px_rgba(255,194,88,0.25)]"
          : data?.rank === 2
          ? "border-blue shadow-[0px_0px_24px_6px_rgba(29,133,232,0.25)]"
          : data?.rank === 3
          ? "border-red shadow-[0px_0px_24px_6px_rgba(253,128,130,0.25)]"
          : ""
      }`}
    >
      {data?.avatar ? (
        <Image
          width={600}
          height={600}
          alt="leaderboardImg"
          src={data?.avatar}
          className="rounded-full object-cover w-[60px] h-[60px] lg:w-[120px] lg:h-[120px]"
        />
      ) : (
        <Fragment>
          <div className="hidden lg:block">
            <AvatarCustom size={120} seed={data?.userAddress} />
          </div>
          <div className="block lg:hidden">
            <AvatarCustom size={60} seed={data?.userAddress} />
          </div>
        </Fragment>
      )}
      <h2 className="mt-2 mb-6 text-lg font-semibold lg:text-2xl">
        {data?.name}
      </h2>
      <div className="bg-[#F8F8F8] dark:bg-darkBG2 rounded-lg w-full flex flex-col items-center pt-6 pb-2 relative">
        <div className="absolute p-2 bg-white rounded-full -top-4 shadow-swiper w-fit">
          <RankIcon
            width={24}
            height={24}
            className={`${
              data?.rank === 1
                ? "fill-yellow"
                : data?.rank === 2
                ? "fill-blue"
                : data?.rank === 3
                ? "fill-red"
                : ""
            }`}
          />
        </div>
        <div className="pb-2 font-semibold border-b border-dark1 w-[60%] text-center">
          {formatToUnit(data?.point)}
        </div>
        <div className="flex my-2 text-sm font-semibold">
          <FormatNumber number={data?.volume} />
          <EtherIcon
            width={20}
            height={20}
            className="fill-dark1 dark:fill-white"
          />
        </div>
        <p className="text-xs font-medium whitespace-nowrap">Season Volume</p>
      </div>
    </div>
  );
};

export default CardList;
