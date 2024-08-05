import { LaunchpadStatus } from "@/enums/launchpad-status";
import request from "../utils/httpRequest";

export const LaunchpadService = {
  LaunchPadInfor: async (launchpadAddress: string, chainId: string) => {
    const res = await request.get(
      `launchpad-info?chainId=${chainId}&launchpadAddress=${launchpadAddress}&unit=1&page=1&limit=10`
    );
    return res.data;
  },
  LaunchpadList: async (
    chainId: string,
    status: LaunchpadStatus,
    page: number
  ) => {
    const res = await request.get(
      `launchpad-list?chainId=${chainId}&status=${status}&page=${page}&limit=20`
    );
    return res.data;
  },
};
