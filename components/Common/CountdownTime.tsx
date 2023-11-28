import { convertTime } from "@/hooks/useConvertTime";
import React, { useEffect, useState } from "react";
interface CountdownTimeProps {
    blockNumber: number,
    query?: string,
}
const CountdownTime: React.FunctionComponent<CountdownTimeProps> = ({
    blockNumber,
    query
}) => {
    const [blockNumberTimer, setBlockNumberTimer] = useState(0);

    const timer = () => {
        const currentTime = Math.floor(Date.now() / 1000);
        const reBase = Math.max(0, blockNumber - currentTime);
        setBlockNumberTimer(reBase);
    };

    useEffect(() => {
        timer();
        const id = setInterval(timer, 1000);
        return () => clearInterval(id);
    }, []);

    useEffect(() => {
        timer();
    }, [blockNumber]);

    const { days, hours, minutes, seconds } = convertTime(blockNumberTimer);

    return (
        <div>
            {query !== "Ended" && (
                <div className="">
                    <p className="text-xs text-center text-dark3">
                        {query === "Active" ? "Whitelist phase ends in:" : "Whitelist phase start in:"}
                    </p>
                    { minutes > 0 && seconds > 0 && (
                        <div className="flex justify-center mt-1 text-secondary2">
                            <div className="flex gap-1 mb-2">
                                <span className="font-semibold">{days}d</span>:
                                <span className="font-semibold">{hours}h</span>:
                                <span className="font-semibold">
                                    {minutes > 9 ? minutes : "0" + minutes}m
                                </span>
                                :
                                <span className="font-semibold">
                                    {seconds > 9 ? seconds : "0" + seconds}s
                                </span>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
export default CountdownTime;
