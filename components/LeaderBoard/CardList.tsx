import { formatToUnit } from "@/libs/utils/formatComon";
import Image from "next/image";
import { Fragment } from "react";
import { AvatarDiceBear } from "../Avatars/AvatarCustom";
import {
  DiamondIcon,
  RankGoldIcon,
  SecondRankIcon,
  ThirdRankIcon,
} from "../Icons";
export const CardListLoading = () => {
  return (
    <div className="flex animate-pulse flex-col items-center justify-center px-2 h-[372px] border rounded-lg text-shader_700 mb-10  border-primary_400 shadow-[0px_8px_24px_0px_rgba(29,133,232,0.25)]">
      <div className="w-[80px] h-[80px] rounded-full bg-slate-700 " />
      <div className="mt-2 mb-6 text-2xl font-semibold">
        <div className="w-20 h-4 rounded-full bg-slate-700 "></div>
      </div>

      <div className="bg-shader_600 rounded-lg w-full flex flex-col items-center pt-6 relative">
        <div className="absolute p-2 bg-white rounded-full -top-4 shadow-swiper w-fit">
          <RankGoldIcon width={24} height={24} className="fill-[#1D85E8]" />
        </div>
        <div className="pb-2 font-semibold border-b border-shader_700 w-[60%] text-center">
          <div className="h-4 rounded-full bg-slate-700 "></div>
        </div>
        <div className="flex my-2 text-sm font-semibold">
          <div className="w-20 h-4 rounded-full bg-slate-700 "></div>
        </div>
      </div>
    </div>
  );
};
const CardList = ({ data }: any) => {
  return (
    <div
      className={`flex relative overflow-hidden flex-col bg-shader_700 border-shader_500 items-center justify-center border p-6 rounded-10 text-white w-full h-fit`}
    >
      <div>
        {data?.rank === 1 ? (
          <RankGoldIcon width={90} height={90} />
        ) : data?.rank === 2 ? (
          <SecondRankIcon width={46} height={52} className="mb-4" />
        ) : data?.rank === 3 ? (
          <ThirdRankIcon width={46} height={52} className="mb-4" />
        ) : (
          <div></div>
        )}
      </div>
      <div className="mb-4 ">
        {data?.avatar ? (
          <Image
            width={600}
            height={600}
            alt="leaderboardImg"
            src={data?.avatar}
            className={`object-cover ${
              data?.rank === 1 ? "w-24 h-24" : "w-20 h-20"
            } rounded-full`}
          />
        ) : (
          <Fragment>
            <div className="hidden lg:block">
              <AvatarDiceBear size={60} seed={data?.userAddress} />
            </div>
            <div className="block lg:hidden">
              <AvatarDiceBear size={60} seed={data?.userAddress} />
            </div>
          </Fragment>
        )}
      </div>
      <h2 className="text-xl font-semibold">{data?.name}</h2>
      <div
        className={`relative flex flex-col items-center w-full  pb-2 rounded-lg ${
          data?.rank === 1 ? "mt-1" : "mt-8"
        }`}
      >
        <p
          className={`mb-3 text-lg font-bold ${
            data?.rank === 1
              ? "text-yellow"
              : data?.rank === 2
              ? "text-blue"
              : data?.rank === 3
              ? "text-primary_500"
              : ""
          }`}
        >
          Top {data?.rank}
        </p>
        <div
          className={`flex items-center font-bold text-center border-shader_700 gap-x-1 bg-opacity-[0.15] rounded-lg 
          px-4
          py-2
        ${
          data?.rank === 1
            ? "bg-yellow"
            : data?.rank === 2
            ? "bg-blue"
            : data?.rank === 3
            ? "bg-primary_500"
            : ""
        }
        `}
        >
          <DiamondIcon width={20} height={20} />
          {formatToUnit(data?.point)}
        </div>
      </div>

      <div className="absolute bottom-0 ">
        {data?.rank === 1 ? (
          <Image
            src="/fillYellow.svg"
            alt="fill"
            width={350}
            height={160}
            className="h-40 w-[350px]"
          />
        ) : data?.rank === 2 ? (
          <Image
            src="/fillBlue.svg"
            alt="fill"
            width={350}
            height={160}
            className="h-40 w-[350px]"
          />
        ) : data?.rank === 3 ? (
          <Image
            src="/fillPurple.svg"
            alt="fill"
            width={350}
            height={160}
            className="h-40 w-[350px]"
          />
        ) : (
          <div></div>
        )}
      </div>
    </div>
  );
};

export default CardList;
