import { DefaultSeoProps } from "next-seo";

export const SEO: DefaultSeoProps = {
  titleTemplate: "%s | App Demask",
  defaultTitle: "App Demask",
  description:
    "Trading crypto collectibles is easier than ever and monetizes the liquidity and referral program. TEST",
  twitter: {
    cardType: "summary_large_image",
    handle: "@DemaskFinance",
    site: "https://twitter.com/DemaskFinance",
  },
  openGraph: {
    title:
      "DeMask - Trading crypto collectibles is easier than ever and monetizes the liquidity and referral program",
    description:
      "DeMask is the leading platform to find solutions to increase liquidity for the market for trading crypto collectibles. ",
    images: [
      {
        url: "https://file.demask.finance/d39fc733640a02ea90bf4891a9a9ca50.png",
      },
    ],
  },
};
