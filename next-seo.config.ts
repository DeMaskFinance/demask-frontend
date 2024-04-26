import { DefaultSeoProps } from "next-seo";

export const SEO: DefaultSeoProps = {
  titleTemplate: "%s | App DeMask",
  defaultTitle: "App DeMask",
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
        url: "https://file.demask.finance/701b9f6b7fe60df3446bbfae7aed2929.png",
      },
    ],
  },
};
