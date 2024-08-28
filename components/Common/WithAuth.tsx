import { ModalWallet } from "@/components/Modal/ModalWallet";
import { selectProfile } from "@/store/profileSlice";
import { useSelector } from "react-redux";
import { BackgroundDefault } from "../Backgrounds";

function WithAuth({ children }: any) {
  const { isLoggedIn } = useSelector(selectProfile);
  return (
    <div>
      <div className="mx-auto pb-6 relative">
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
