import React, { useState } from "react";

export default function CategoryProfileLaunchPad({
  listCategories,
  listLaunchpad,
}: any) {
  return (
    <div className="p-2 border rounded-md lg:w-1/5 h-fit">
      <ul className="flex flex-col gap-2">
        {listCategories.map((item: any, idx: number) => (
          <li
            key={idx}
            className={`${listLaunchpad === idx
                ? "bg-secondary5 text-white "
                : "hover:bg-slate-200 hover:text-gray"
              } px-2 py-1 rounded-md  transition-all`}
          >
            <button onClick={item.onClick} className="w-full text-left">
              {item.label}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
