import React, { useContext, useState } from "react";
import { FixIcon } from "../Icons";
import { CgClose } from "react-icons/cg";
import { useQuery } from "@tanstack/react-query";
import { categoryAPI } from "@/libs/service/categoriesChartService";
import AccountContext from "@/context/AccountContext";

const Maintenance = () => {
  const [isOpen, setIsOpen] = useState<boolean>(true);
  const { chainId } = useContext(AccountContext);
  const { isLoading, data, isSuccess } = useQuery({
    queryKey: ["blockStatus", chainId],
    queryFn: async () => {
      const res = await categoryAPI(`block-status?chainId=${chainId}`);
      return res;
    },
  });

  return (
    <>
      {data && isSuccess && isOpen && data.status && (
        <div className="flex text-white gap-x-2 text-[8px] lg:text-base bg-gradient-to-b from-[#BA8DE6] to-[#7B54E8] justify-center items-center py-2 text-sm">
          <FixIcon width={24} height={24} />
          <p>{data.message}</p>
          <CgClose
            className="text-xl transition-colors duration-100 ease-linear cursor-pointer hover:text-red"
            onClick={() => setIsOpen(false)}
          />
        </div>
      )}
    </>
  );
};

export default Maintenance;
