import { LogoMaintenance } from "@/components/Logo/Logo";
import { useState, useEffect } from "react";

function MaintenanceError() {
    const [days, setDays] = useState(0);
    const [hours, setHours] = useState(0);
    const [minutes, setMinutes] = useState(0);
    const [seconds, setSeconds] = useState(0);
    const today = new Date();
    useEffect(() => {
        const countDownDate = new Date("Dec 10, 2023 15:37:25").getTime();

        const interval = setInterval(() => {
            const now = new Date().getTime();
            const distance = countDownDate - now;

            if (distance <= 0) {
                clearInterval(interval);
                setDays(0);
                setHours(0);
                setMinutes(0);
                setSeconds(0);
            } else {
                const daysRemaining = Math.floor(distance / (1000 * 60 * 60 * 24));
                const hoursRemaining = Math.floor(
                    (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
                );
                const minutesRemaining = Math.floor(
                    (distance % (1000 * 60 * 60)) / (1000 * 60)
                );
                const secondsRemaining = Math.floor((distance % (1000 * 60)) / 1000);

                setDays(daysRemaining);
                setHours(hoursRemaining);
                setMinutes(minutesRemaining);
                setSeconds(secondsRemaining);
            }
        }, 1000);

        return () => {
            clearInterval(interval);
        };
    }, []);
    return (
        <div className="flex flex-col items-center justify-center min-h-[83vh]">
            <h2 className="text-2xl font-semibold text-dark1">Maintenance</h2>
            <div className="my-8">
                <LogoMaintenance width={350} height={288} className="w-full h-full" />
            </div>
            <h3 className="text-xl font-semibold text-center text-dark2">{days} days, {hours} hours, {minutes} minutes, {seconds} seconds</h3>
            <p className="mt-2 text-sm font-semibold cursor-pointer text-secondary2">We are coming back soon!</p>
        </div>
    );
}

export default MaintenanceError;