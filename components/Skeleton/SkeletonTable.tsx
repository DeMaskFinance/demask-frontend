import React from "react";

interface SkeletonTableProps {
  length: number;
}

const SkeletonTable: React.FC<SkeletonTableProps> = ({ length }) => {
  const skeletonRows = Array.from({ length }, (item, index) => (
    <tr
      key={index}
      className="flex text-sm lg:text-base md:text-base text-dark2"
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

export default SkeletonTable;
