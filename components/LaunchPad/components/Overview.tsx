import {
  SepoliaIcon,
  TeleIcon,
  TwitterIcon,
  WebsiteIcon,
} from "@/components/Icons";
import ShowMoreText from "react-show-more-text";
const Overview: React.FC<{ data: LaunchpadData }> = ({ data }) => {
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

  return (
    <div>
      {data && (
        <div className="text-sm text-shader_200 ">
          <p className="text-white text-2xl font-bold">Toshi in Lisbon</p>
          <div className="flex gap-x-2 my-4">
            <a
              href={`https://twitter.com/${data?.launchpadInfo?.twitter}`}
              rel="noreferrer noopener"
              target="_blank"
            >
              <SepoliaIcon width={24} height={24} />
            </a>
            <a
              href={`https://twitter.com/${data?.launchpadInfo?.twitter}`}
              rel="noreferrer noopener"
              target="_blank"
            >
              <WebsiteIcon width={24} height={24} />
            </a>
            <a
              href={`https://twitter.com/${data?.launchpadInfo?.twitter}`}
              rel="noreferrer noopener"
              target="_blank"
            >
              <TwitterIcon width={24} height={24} />
            </a>
            <a
              href={`https://t.me/${data?.launchpadInfo?.twitter}`}
              rel="noreferrer noopener"
              target="_blank"
            >
              <TeleIcon width={24} height={24} />
            </a>
          </div>
          {/* <p>{data?.metadata?.description}</p> */}
          <ShowMoreText
            lines={4}
            more="See more"
            less="See less"
            className="w-full my-2"
            anchorClass="show-more-less-clickable"
            expanded={false}
            truncatedEndingComponent={"... "}
          >
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat. Duis aute irure dolor in
            reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
            pariatur. Lorem ipsum dolor sit amet, consectetur adipiscing elit,
            sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
            Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris
            nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in
            reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
            pariatu...
          </ShowMoreText>
        </div>
      )}
    </div>
  );
};

export default Overview;
