import { BackgroundDefault } from "@/components/Backgrounds";
import Referral from "@/components/Referral";
import { SEO } from "@/next-seo.config";
import { NextSeo } from "next-seo";
const updateMeta = {
  ...SEO,
  title: "Referral",
};
export default function ReferralPage() {
  return (
    <BackgroundDefault>
      <div className="min-h-[94vh] py-8 max-w-[1400px] mx-auto md:px-10 lg:px-24 px-4">
        <NextSeo {...updateMeta} />
        <Referral />
      </div>
    </BackgroundDefault>
  );
}
