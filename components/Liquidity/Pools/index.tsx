import React, { useState } from "react";
import UserPools from "./UserPools";
import { Button } from "@/components/Buttons";
import { PoolIcon, UserIcon } from "@/components/Icons";
import SwipeableViews from "react-swipeable-views";
import TotalPools from "./TotalPools";
const Pools = () => {
  const [index, setIndex] = useState<number>(0);
  const handleChangeIndex = (index: number) => {
    setIndex(index);
  };

  return (
    <div>
      <div className="flex gap-x-2">
        <Button
          primary={index === 0}
          active={index === 1}
          className="px-6 h-10 my-4 flex gap-x-2"
          onClick={() => setIndex(0)}
        >
          <PoolIcon width={16} height={16} />
          All Pools
        </Button>
        <Button
          primary={index === 1}
          active={index === 0}
          className="px-6 h-10 my-4 flex gap-x-2"
          onClick={() => setIndex(1)}
        >
          <UserIcon width={16} height={16} />
          My Positions
        </Button>
      </div>
      <SwipeableViews index={index} onChangeIndex={handleChangeIndex}>
        <TotalPools />
        <UserPools />
      </SwipeableViews>
    </div>
  );
};

export default Pools;
