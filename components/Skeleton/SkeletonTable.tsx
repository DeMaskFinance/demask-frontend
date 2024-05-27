import React from "react";

interface SkeletonTableProps {
  length: number;
}

const SkeletonTable: React.FC<SkeletonTableProps> = ({ length }) => {
  const skeletonRows = Array.from({ length }, (item, index) => (
    <tr
      key={index}
      className="flex text-sm lg:text-base md:text-base text-shader_600"
    >
      <td className="py-2 flex items-center justify-start lg:w-[440px] md:w-[340px] w-[50px]">
        <p className="w-[100%] h-8 bg-slate-200 dark:bg-slate-700 animate-pulse mr-2 rounded-xl" />
      </td>
      <td className="py-2 flex items-center justify-start lg:w-full md:w-full w-[200px]">
        <p className="w-[100%] h-8 bg-slate-200 dark:bg-slate-700 animate-pulse mr-2 rounded-xl" />
      </td>
      <td className="py-2 flex items-center justify-end lg:w-full md:w-full w-[140px]">
        <p className="w-[100%] h-8 bg-slate-200 dark:bg-slate-700 animate-pulse mr-2 rounded-xl" />
      </td>
      <td className="py-2 flex items-center justify-end lg:w-full md:w-full w-[140px]">
        <p className="w-[100%] h-8 bg-slate-200 dark:bg-slate-700 animate-pulse mr-2 rounded-xl" />
      </td>
      <td className="py-2 flex items-center justify-end lg:w-full md:w-full w-[140px]">
        <p className="w-[100%] h-8 bg-slate-200 dark:bg-slate-700 animate-pulse mr-2 rounded-xl" />
      </td>
    </tr>
  ));

  return <>{skeletonRows}</>;
};
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
          className="text-shader_600 text-base max-md:text-[12px] bg-transparent rounded-lg border-gray-700 bg-white hover:bg-slate-100 cursor-pointer"
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
export { SkeletonTable, TableRowSkeleton };
