import {
  EtherIcon,
  SepoliaIcon,
  TeleIcon,
  TwitterIcon,
  WebsiteIcon,
} from "@/components/Icons";
import Link from "next/link";
import ShowMoreText from "react-show-more-text";

import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
const Overview: React.FC<{ data: LaunchpadData }> = ({ data }) => {
  const socialIcons = [
    { url: data?.networkLink, Icon: EtherIcon },
    { url: data?.website, Icon: WebsiteIcon },
    { url: data?.twitter, Icon: TwitterIcon },
    { url: data?.telegram, Icon: TeleIcon },
  ];

  return (
    <div>
      {data && (
        <div className="text-sm text-shader_200 ">
          <p className="text-white text-2xl font-bold">{data.metadata.name}</p>
          <div className="flex gap-x-2 my-4">
            {socialIcons.map(
              ({ url, Icon }, index) =>
                url && (
                  <Link key={index} href={url} target="_blank">
                    <Icon width={18} height={18} />
                  </Link>
                )
            )}
          </div>


          <p className="text-md pb-8">
            <ReactMarkdown rehypePlugins={[rehypeRaw]}>{data?.metadata?.description}</ReactMarkdown>
          </p>

          {/* <ShowMoreText
            lines={4}
            more="See more"
            less="See less"
            className="w-full my-2"
            anchorClass="show-more-less-clickable"
            expanded={false}
            truncatedEndingComponent={"... "}
          >
            {data.detailLaunchpad}
          </ShowMoreText> */}
        </div>
      )}
    </div>
  );
};

export default Overview;
