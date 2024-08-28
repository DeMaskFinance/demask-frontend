import WithAuth from "@/components/Common/WithAuth";
import Profile from "@/components/Profile/Profile";
import { SEO } from "@/next-seo.config";
import { NextSeo } from "next-seo";
const updateMeta = {
  ...SEO,
  title: "Profile",
};
function ProfilePage() {
  return (
    <WithAuth>
      <NextSeo {...updateMeta} />
      <Profile />
    </WithAuth>
  );
}

export default ProfilePage;
