import TabLaunchPad from "@/components/LaunchPad/components/TabLauchPad";
import CardLaunchpad from "./CardLaunchpad";
export default function UserLaunchpad() {
  return (
    <div>
      <h1 className="text-xl font-semibold text-shader_900">Invested</h1>
      <CardLaunchpad />
      <h1 className="text-xl font-semibold text-shader_900">
        Upcoming Projects
      </h1>
      <TabLaunchPad
        query={"Upcoming"}
        desc={"There are currently no launchpads in the list."}
      />
    </div>
  );
}
