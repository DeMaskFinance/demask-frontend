import divideByDecimal from "@/libs/utils/divideByDecimal";
import formatNumber from "@/libs/utils/formatNumer";
import ModalNumber from "../Modal/ModalLength/ModalNumber";
import FormatNumber from "../Common/FormatNumber";

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
  console.log(data);

  return (
    <>
      {isLoading || isFetching ? (
        skeleton.map((item, index) => (
          <div
            key={index}
            className="grid gap-4 grid-cols-[80px,repeat(3,2fr),4fr] text-dark3 text-sm font-light mb-2 animate-pulse h-4"
          >
            <p className="rounded-full bg-slate-200"></p>
            <p className="rounded-full bg-slate-200"></p>
            <p className="rounded-full bg-slate-200"></p>
            <p className="rounded-full bg-slate-200"></p>
            <p className="rounded-full bg-slate-200"></p>
          </div>
        ))
      ) : (
        <>
          {data.liquidityHistory.map((item: any, index: number) => (
            <div
              className="grid gap-4 lg:grid-cols-[80px,repeat(3,2fr),3fr] grid-cols-[150px,100px,100px,100px,200px]  text-dark1 mb-2"
              key={index}
            >
              <div className={`${item.action === "Add" ? "text-green" : "text-red"}`}>{item.action}</div>
              <div>
                <ModalNumber data={item.liquidity} />
              </div>
              <div>
                <FormatNumber number={item.amountNFT} />
              </div>
              <div>
                <ModalNumber data={item.amountToken} />
              </div>
              <p>{item.blockTime}</p>
            </div>
          ))}
        </>
      )}
    </>
  );
};

export default LiquiditiesHistory;
