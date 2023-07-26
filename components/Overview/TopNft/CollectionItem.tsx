import React from "react";
interface CollectionItemProps {
  data: any;
  isFetching: boolean;
  isLoading: boolean;
}
const CollectionItem: React.FC<CollectionItemProps> = ({
  data,
  isFetching,
  isLoading,
}) => {
  const skeleton = (
    <div className="w-full h-6 bg-slate-200 animate-pulse rounded-xl" />
  );
  return (
    <>
      {isLoading ? (
        <tr>
          <td className="py-6">{skeleton}</td>
          <td>{skeleton}</td>
          <td>{skeleton}</td>
          <td>{skeleton}</td>
          <td>{skeleton}</td>
          <td>{skeleton}</td>
          <td>{skeleton}</td>
        </tr>
      ) : (
        <>
          {data?.nftDataList.map((item: any) => (
            <tr className="lg:text-base md:text-base text-sm flex text-dark2">
              <td className="py-6 flex justify-start lg:w-full md:w-full w-[200px]">
                <span className="line-clamp-1">
                  {isFetching ? skeleton : item.metadata.name}
                </span>
              </td>
              <td className="py-6 flex justify-end lg:w-full md:w-full w-[140px]">
                <span className="">{isFetching ? skeleton : item.price}</span>
              </td>
              <td className="py-6 flex justify-end lg:w-full md:w-full w-[140px]">
                <span className="">
                  {isFetching ? skeleton : item.changePrice}
                </span>
              </td>
              <td className="py-6 flex justify-end lg:w-full md:w-full w-[140px]">
                <span className="">{isFetching ? skeleton : item.volume}</span>
              </td>
              <td className="py-6 flex justify-end lg:w-full md:w-full w-[140px]">
                {isFetching ? skeleton : item.tvl}
              </td>
              <td className="py-6 flex justify-end lg:w-full md:w-full w-[140px]">
                {isFetching ? skeleton : item.totalSupply}
              </td>
            </tr>
          ))}
        </>
      )}
    </>
  );
};

export default CollectionItem;
