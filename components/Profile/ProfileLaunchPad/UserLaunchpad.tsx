import { useState } from "react";
import CardLaunchpad from "./CardLaunchpad";
import LaunchpadReleased from "./LaunchpadReleased";
import TabLaunchPad from "@/components/LaunchPad/components/TabLauchPad";
export default function UserLaunchpad() {
  return (
    <div>
      <h1 className="text-xl font-semibold text-dark0">Invested</h1>
      <CardLaunchpad />
      <h1 className="text-xl font-semibold text-dark0">Upcoming Projects</h1>
      <TabLaunchPad
        query={"Upcoming"}
        desc={"There are currently no launchpads in the list."}
      />
    </div>
  );
}
