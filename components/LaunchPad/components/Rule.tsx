import FormatNumber from "@/components/Common/FormatNumber";
import { TeleIcon, TwitterIcon } from "@/components/Icons";
import { FiShare } from "react-icons/fi";
const Rule: React.FC<{ data: LaunchpadData }> = ({ data }) => {
  const options: Intl.DateTimeFormatOptions = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    timeZone: "UTC",
  };
  const startDate = new Date(Number(+data.startTime * 1000)).toLocaleString(
    "en-US",
    options
  );
  const endDate = new Date(Number(+data.endTime * 1000)).toLocaleString(
    "en-US",
    options
  );
  const ruleInfor = [
    {
      projectName: () => (
        <p>Project Name: {data?.launchpadInfo?.projectName}</p>
      ),
    },
    {
      Buyers: () => <p>Buyers: Everyone</p>,
    },
    {
      Amount: () => (
        <div className="flex">
          Hard Cap:
          <FormatNumber number={(+data?.hardcap / 1e18).toString()} />
          <p className="ml-1">ETH</p>
        </div>
      ),
    },
    {
      Currency: () => <p>Currency: ETH</p>,
    },
    {
      Price: () => (
        <div className="flex">
          Price:
          <FormatNumber number={(+data?.price / 1e18).toString()} />
          <p className="ml-1">ETH/NFT</p>
        </div>
      ),
    },
    {
      SaleDate: () => (
        <p>
          Sale Date: {startDate} - {endDate}
        </p>
      ),
    },
    {
      Member: () => <p>Member: {data?.launchpadInfo?.teamDescription}</p>,
    },
    {
      Purpose: () => <p>Purpose: {data?.launchpadInfo?.purpose}</p>,
    },
    {
      Reward: () => <p>Reward: NFTs will be airdropped after the sale ends</p>,
    },
  ];
  return (
    <div>
      {data && (
        <div className="text-sm text-[#000] ">
          <ul>
            {ruleInfor.map((item, index) => (
              <li className="mb-[1px] flex" key={index}>
                ▪️
                <div className="ml-1">{Object.values(item)[0]()}</div>
              </li>
            ))}
          </ul>
          <h3 className="my-1">NFT DESCRIPTION:</h3>
          <p>{data?.metadata?.description}</p>
          <div className="flex items-center mt-2 gap-x-4">
            <p className="font-semibold">Website</p>
            <div className="px-2 py-1 cursor-pointer bg-shader_500 gap-x-1 border-shader_700">
              <a
                className="flex items-center gap-x-1 hover:text-primary_500"
                rel="noreferrer noopener"
                target="_blank"
                href={`${data?.launchpadInfo?.website}`}
              >
                {data?.launchpadInfo?.website}
                <FiShare />
              </a>
            </div>
          </div>
          <div className="flex mt-2 gap-x-8">
            <p className="font-semibold">Social</p>
            <div className="flex gap-x-2">
              <a
                href={`https://twitter.com/${data?.launchpadInfo?.twitter}`}
                rel="noreferrer noopener"
                target="_blank"
              >
                <TwitterIcon
                  width={20}
                  height={20}
                  className="fill-shader_500 hover:fill-primary_400"
                />
              </a>
              <a
                href={`https://t.me/${data?.launchpadInfo?.twitter}`}
                rel="noreferrer noopener"
                target="_blank"
              >
                <TeleIcon
                  width={20}
                  height={20}
                  className="fill-shader_500 hover:fill-primary_400"
                />
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Rule;
