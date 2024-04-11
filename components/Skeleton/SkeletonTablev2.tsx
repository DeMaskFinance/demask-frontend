import React from "react";

interface TableRowSkeletonProps {
  length: number;
  col: number;
}

const TableRowSkeleton: React.FC<TableRowSkeletonProps> = ({ length, col }) => {
  const skeleton = (
    <div className="w-[100%] h-8 bg-slate-200 dark:bg-slate-700 animate-pulse rounded-xl" />
  );

  return (
    <>
      {Array.from({ length }, (_, rowIndex) => (
        <tr
          key={rowIndex}
          className="text-dark2 text-base max-md:text-[12px] bg-transparent rounded-lg border-gray-700 bg-white hover:bg-slate-100 cursor-pointer"
        >
          <td
            scope="row"
            className="sticky left-0 z-10 flex items-center px-1 py-2 font-medium md:min-w-max md:px-6 whitespace-nowrap"
            style={{ width: "100%" }}
          >
            {skeleton}
          </td>
          {Array.from({ length: col }, (_, colIndex) => (
            <td key={colIndex} className="">
              {skeleton}
            </td>
          ))}
        </tr>
      ))}
    </>
  );
};

export default TableRowSkeleton;
