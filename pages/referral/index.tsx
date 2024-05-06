import Referral from "@/components/Referral";
import { SEO } from "@/next-seo.config";
import { NextSeo } from "next-seo";
const updateMeta = {
  ...SEO,
  title: "Referral",
};
export default function ReferralPage() {
  return (
    <div className="min-h-[80vh] py-8 max-w-[1400px] mx-auto">
      <NextSeo {...updateMeta} />
      <Referral />
    </div>
  );
}
