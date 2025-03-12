import { getNonce, loginAuthen } from "@/libs/service/userService";
import { login, selectProfile } from "@/store/profileSlice";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useAccount, useSignMessage, useDisconnect } from "wagmi";

const ProfileReconnectProvider = ({ children }: { children: React.ReactNode }) => {
    const dispatch = useDispatch();
    const { address, isConnected } = useAccount();
    const { signMessageAsync } = useSignMessage();
    const { disconnect } = useDisconnect();
    const { accessToken } = useSelector(selectProfile);
    const [isSigning, setIsSigning] = useState(false);

    const signAndAuthenticate = async () => {
        try {
            if (!address || isSigning) return;
            setIsSigning(true);

            const { data: sign } = await getNonce(address);
            const signedData = await signMessageAsync({ message: String(sign.nonce) });

            if (!signedData) {
                disconnect();
                return;
            }

            const loginData = await loginAuthen({
                userAddress: address,
                signature: signedData,
            });

            dispatch(login({ accessToken: loginData.accessToken, user: address }));
            localStorage.setItem("PROFILE", JSON.stringify({
                accessToken: loginData.accessToken,
                user: address
            }));
        } catch (error) {
            console.error(error);
            disconnect();
        } finally {
            setIsSigning(false);
        }
    };

    useEffect(() => {
        const storedProfile = localStorage.getItem("PROFILE");
        if (storedProfile) {
            const profileData = JSON.parse(storedProfile);
            if (!accessToken) {
                dispatch(login(profileData));
            }
        }
    }, [dispatch, accessToken]);

    useEffect(() => {
        if (address && isConnected && !accessToken) {
            signAndAuthenticate();
        }
    }, [address, isConnected, accessToken]);

    return <>{children}</>;
};

export default ProfileReconnectProvider;
