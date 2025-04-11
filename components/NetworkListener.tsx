import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useChainId } from "wagmi";

const NetworkListener = () => {
    const chainId = useChainId();
    const [prevChainId, setPrevChainId] = useState<number | null>(null);


    useEffect(() => {
        if (prevChainId !== null && chainId !== prevChainId) {
            toast.success(`Switched to chain ID: ${chainId} 🎉`);
        }
        setPrevChainId(chainId);
    }, [chainId]);

    return null;
};

export default NetworkListener;
