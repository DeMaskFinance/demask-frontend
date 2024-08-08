type StatusType = "Live" | "Coming Soon" | "Ended";
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
interface MetadataLaunchpad extends Metadata {
  banner: string;
}
interface LaunchpadData extends Socials {
  blockNumber: number;
  launchpadAddress: string;
  detailLaunchpad: string;
  metadata: MetadataLaunchpad;
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
