type StatusType = "Live" | "Upcoming" | "Ended";
type LaunchpadItem = {
  endTime: number;
  limit: number;
  max_allocation: number;
  merkleRoot: string;
  price: number;
  priceDecimals: number;
  startTime: number;
  status: string;
  unit: number;
};
interface LaunchpadData extends Socials {
  blockNumber: number;
  launchpadAddress: string;
  detailLaunchpad: string;
  metadata: Metadata;
  unit: number;
  endTime: number;
  limit: number;
  max_allocation: number;
  merkleRoot: string;
  price: number;
  priceDecimals: number;
  startTime: number;
  totalSoldOut: number;
  mintPercent: number;
  launchpadList: {
    data: [LaunchpadItem];
  };
  status: StatusType;
}
