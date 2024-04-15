import FormatNumber from "../Common/FormatNumber";
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
            className="grid gap-4 grid-cols-[80px,repeat(3,2fr),4fr] text-dark3 text-sm font-light mb-2 animate-pulse h-4"
          >
            <p className="rounded-full bg-slate-200 dark:bg-slate-700"></p>
            <p className="rounded-full bg-slate-200 dark:bg-slate-700"></p>
            <p className="rounded-full bg-slate-200 dark:bg-slate-700"></p>
            <p className="rounded-full bg-slate-200 dark:bg-slate-700"></p>
            <p className="rounded-full bg-slate-200 dark:bg-slate-700"></p>
          </div>
        ))
      ) : (
        <>
          {data.liquidityHistory.map((item: any, index: number) => (
            <div
              className="grid gap-4  py-2 lg:grid-cols-[repeat(4,4fr),200px] grid-cols-[150px,100px,100px,100px,200px]  text-dark1 "
              key={index}
            >
              <div
                className={`border text-xs ml-3 text-center bg-opacity-10 w-16 ${
                  item.action === "Add"
                    ? "border-green text-green bg-green"
                    : "border-red text-red bg-red"
                } p-1 rounded-lg`}
              >
                {item.action}
              </div>
              <div className="mx-auto">
                <ModalNumber data={item.liquidity} />
              </div>
              <div className="mx-auto">
                <FormatNumber number={item.amountNFT} />
              </div>
              <div className="mx-auto">
                <ModalNumber data={item.amountToken} />
              </div>
              <p className="flex justify-end">{item.blockTime}</p>
            </div>
          ))}
        </>
      )}
    </>
  );
};

export default LiquiditiesHistory;
