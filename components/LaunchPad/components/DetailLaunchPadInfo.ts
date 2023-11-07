import React from "react";

export const formatDate = (timestamp: number) => {
  const date = new Date(timestamp * 1000);

  const year = date.getUTCFullYear();
  const month = (date.getUTCMonth() + 1).toString().padStart(2, "0");
  const day = date.getUTCDate().toString().padStart(2, "0");
  const hours = date.getUTCHours().toString().padStart(2, "0");
  const minutes = date.getUTCMinutes().toString().padStart(2, "0");

  const formattedDate = `${year}.${month}.${day} ${hours}:${minutes} (UTC)`;

  return formattedDate;
};
export default function DetailLaunchPadInfo(data: any) {
  const listInfo = [
    {
      name: "Token Name",
      value: data?.metadata?.name,
    },
    {
      name: "Token Symbol",
      value: data?.metadata?.symbol,
    },
    {
      name: "Token Decimals",
      value: data?.metadata?.name,
    },
    {
      name: "Token Address",
      value: data?.launchpad,
    },

    {
      name: "Price",
      value: data?.price / 1e18,
    },
    {
      name: "Price listing",
      value: data?.priceListing / 1e18,
    },
    {
      name: "Soft Cap",
      value: data?.softcap,
    },
    {
      name: "Presale Start Time",
      value: formatDate(data?.startTime),
    },
    {
      name: "Presale End Time",
      value: formatDate(data?.endTime),
    },

    {
      name: "Listing On",
      value: "Demask Finance",
    },
    {
      name: "Liquidity Percent",
      value: data?.percentLock / 10000 + "%",
    },
    {
      name: "Liquidity Unlocked Time",
      value: formatDate(parseInt(data?.endTime) + parseInt(data?.durationLock)),
    },
  ];
  return listInfo;
}
