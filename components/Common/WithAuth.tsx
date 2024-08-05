import { ModalWallet } from "@/components/Modal/ModalWallet";
import { selectProfile } from "@/store/profileSlice";
import { useState } from "react";
import { useSelector } from "react-redux";
import "tippy.js/dist/tippy.css";
import { BackgroundDefault } from "../Backgrounds";

function WithAuth({ children }: any) {
  const { isLoggedIn } = useSelector(selectProfile);
  return (
    <div>
      <div className="mx-auto min-h-[94vh] relative">
        {isLoggedIn ? (
          <div>{children}</div>
        ) : (
          <BackgroundDefault>
            <div className="w-full min-h-[70vh] flex justify-center items-center">
              <ModalWallet isAuthen={true} />
            </div>
          </BackgroundDefault>
        )}
      </div>
    </div>
  );
}

export default WithAuth;
