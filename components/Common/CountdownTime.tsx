import { convertTime } from "@/hooks/useConvertTime";
import React, { useEffect, useState } from "react";
interface CountdownTimeProps {
    blockNumber: number,
    setCurrentTimer?: any
}
const CountdownTime: React.FunctionComponent<CountdownTimeProps> = ({
    blockNumber,
    setCurrentTimer
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
        <div className="pb-4 h-14">
            <div>
                {minutes + seconds > 0 && (
                    <div className="flex gap-2 text-white">
                        <div className="flex justify-between w-full gap-4 px-5 mb-2">
                            <span className="px-2 py-1 border rounded-md">{days}d</span>
                            <span className="px-2 py-1 border rounded-md">{hours}h</span>

                            <span className="px-2 py-1 border rounded-md">
                                {minutes > 9 ? minutes : "0" + minutes}m
                            </span>
                            <span className="px-2 py-1 border rounded-md">
                                {seconds > 9 ? seconds : "0" + seconds}s
                            </span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
export default CountdownTime;
