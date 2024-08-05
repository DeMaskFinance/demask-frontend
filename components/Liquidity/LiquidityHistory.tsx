import { getColorType } from "@/libs/utils/getColorType";
import FormatNumber from "../Common/FormatNumber";
import { EtherIcon, NFTIcon } from "../Icons";
import ModalNumber from "../Modal/ModalLength/ModalNumber";

interface LiquiditiesHistoryProps {
  data: any;
  isFetching: boolean;
  isLoading: boolean;
}
const skeleton = [1, 1, 1, 1, 1, 1, 1, 5];
const LiquiditiesHistory: React.FunctionComponent<LiquiditiesHistoryProps> = ({
  data,
  isFetching,
  isLoading,
}) => {
  return (
    <>
      {isLoading || isFetching ? (
        skeleton.map((item, index) => (
          <div
            key={index}
            className="grid gap-4 grid-cols-[80px,repeat(3,2fr),4fr] text-shader_500 text-sm font-light mb-2 animate-pulse h-4"
          >
            <p className="rounded-full bg-slate-700 "></p>
            <p className="rounded-full bg-slate-700 "></p>
            <p className="rounded-full bg-slate-700 "></p>
            <p className="rounded-full bg-slate-700 "></p>
            <p className="rounded-full bg-slate-700 "></p>
          </div>
        ))
      ) : (
        <>
          {data.liquidityHistory.map((item: any, index: number) => (
            <div
              className="grid gap-4 text-sm text-white py-4 font-semibold hover:bg-shader_700 border-y border-shader_500 lg:grid-cols-[repeat(4,4fr),200px] grid-cols-[150px,100px,100px,100px,200px]  "
              key={index}
            >
              <div
                className={`bg-opacity-[0.15] w-[73px] text-center ml-3 ${getColorType(
                  item.action
                )} py-1 rounded-lg`}
              >
                {item.action}
              </div>
              <div className="mx-auto flex items-center gap-x-1">
                <ModalNumber data={item.liquidity} />
                <EtherIcon width={16} height={16} />
              </div>
              <div className="mx-auto flex items-center gap-x-1">
                <FormatNumber number={item.amountNFT} />
                <NFTIcon width={16} height={16} />
              </div>
              <div className="mx-auto flex items-center gap-x-1">
                <ModalNumber data={item.amountToken} />
                <EtherIcon width={16} height={16} />
              </div>
              <p className="flex justify-end pr-3">{item.blockTime}</p>
            </div>
          ))}
        </>
      )}
    </>
  );
};

export default LiquiditiesHistory;
