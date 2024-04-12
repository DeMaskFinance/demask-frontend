import WithAuth from "@/components/Common/WithAuth";
import EditProfile from "@/components/Profile/EditProfile";
import { SEO } from "@/next-seo.config";
import { NextSeo } from "next-seo";
import React from "react";
const updateMeta = {
  ...SEO,
  title: "Edit Profile",
};
export default function EditPage() {
  return (
    <WithAuth>
      <NextSeo {...updateMeta} />
      <EditProfile />
    </WithAuth>
  );
}
