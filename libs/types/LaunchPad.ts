type StatusType = "Live" | "Upcoming" | "Ended";
interface LaunchpadData {
  blockNumber: number;
  launchpadAddress: string;
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
  status: StatusType;
}
