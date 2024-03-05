import { DefaultSeoProps } from "next-seo";

export const SEO: DefaultSeoProps = {
  titleTemplate: "%s | DeMask App",
  defaultTitle: "DeMask App",
  description:
    "Trading crypto collectibles is easier than ever and monetizes the liquidity and referral program.",
  // twitter: {
  //   cardType: "summary_large_image",
  //   handle: "@DeMask",
  //   site: "@DeMask",
  // },
  openGraph: {
    title:
      "DeMask - Trading crypto collectibles is easier than ever and monetizes the liquidity and referral program",
    description:
      "DeMask is the leading platform to find solutions to increase liquidity for the market for trading crypto collectibles. ",
    images: [{ url: "https://demask.infura-ipfs.io/ipfs/QmfAAXAgAWFqkAovUa4u8iwtr4zYCCdqs35Fu3kAt2n4DH" }],
  },
};
