import { useRouter } from "next/router";
import React from "react";
import { LeftIcon } from "../Icons";

const Back = () => {
  const router = useRouter();

  return (
    <div
      className="flex items-center cursor-pointer gap-x-2 py-4 md:py-6"
      onClick={() => router.back()}
    >
      <LeftIcon width={20} height={20} />

      <p className="font-semibold text-white">Back</p>
    </div>
  );
};

export default Back;
