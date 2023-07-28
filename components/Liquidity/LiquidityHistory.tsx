import formatNumber from "@/libs/utils/formatNumer";

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
          {data.liquidityHistory.map((item:any, index:number) => (
            <div
              className="grid gap-4 grid-cols-[80px,repeat(3,2fr),4fr] text-dark1 font-medium mb-2"
              key={index}
            >
              <p>{item.action}</p>
              <p>{item.liquidity}</p>
              <p>{formatNumber(item.amountnft)}</p>
              <p>{formatNumber(item.amounttokenInUSD)}</p>
              <p>{item.blockTime}</p>
            </div>
          ))}
        </>
      )}
    </>
  );
};

export default LiquiditiesHistory;
