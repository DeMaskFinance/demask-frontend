import { ModalWallet } from "@/components/Modal/ModalWallet";
import { selectProfile } from "@/store/profileSlice";
import { useState } from "react";
import { useSelector } from "react-redux";
import "tippy.js/dist/tippy.css";
import { BackgroundDefault } from "../Backgrounds";

function WithAuth({ children }: any) {
  const { isLoggedIn } = useSelector(selectProfile);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <div>
      <div className="mx-auto min-h-[94vh] relative">
        {isLoggedIn ? (
          <div>{children}</div>
        ) : (
          <BackgroundDefault>
            <ModalWallet
              isOpen={!isLoggedIn}
              setIsOpen={setIsOpen}
              isAuthen={true}
            />
          </BackgroundDefault>
        )}
      </div>
    </div>
  );
}

export default WithAuth;
