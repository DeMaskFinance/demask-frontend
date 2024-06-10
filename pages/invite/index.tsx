import { BackgroundDefault } from "@/components/Backgrounds";
import Invite from "@/components/Referral/Invite";
import React from "react";

const InvitePage = () => {
  return (
    <BackgroundDefault>
      <div className="min-h-[94vh] py-8 max-w-[1400px] mx-auto">
        <Invite />
      </div>
    </BackgroundDefault>
  );
};

export default InvitePage;
