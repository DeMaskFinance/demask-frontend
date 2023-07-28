import React from "react";
import InterestItem from "./InterestItem";
import Creators from "./Creators";

function SocialBar() {
  return (
    <div className="lg:w-[40%] md:w-[40%] w-full">
      <div className="sticky top-5 transition-all">
        <InterestItem />
        <Creators />
      </div>
    </div>
  );
}

export default SocialBar;
