import { ModalWallet } from "@/components/Modal/ModalWallet";
import { selectProfile } from "@/store/profileSlice";
import { useState } from "react";
import { useSelector } from "react-redux";
import "tippy.js/dist/tippy.css";

function WithAuth({ children }: any) {
  const { isLoggedIn } = useSelector(selectProfile);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <div>
      <div className="mx-auto min-h-[80vh]">
        {isLoggedIn ? (
          <div>{children}</div>
        ) : (
          <ModalWallet
            isOpen={!isLoggedIn}
            setIsOpen={setIsOpen}
            isAuthen={true}
          />
        )}
      </div>
    </div>
  );
}

export default WithAuth;
