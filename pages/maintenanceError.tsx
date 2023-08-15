import { LogoMaintenance } from "@/components/Logo/Logo";
import React from "react";

function MaintenanceError() {
    const today = new Date();

    return (
        <div className="flex flex-col items-center justify-center min-h-[83vh]">
            <h2 className="text-2xl font-semibold text-dark1">Maintenance</h2>
            <div className="my-8">
                <LogoMaintenance width={350} height={288} className="w-full h-full" />
            </div>
            <h3 className="text-xl font-semibold text-dark2">{today.getHours()}:{today.getMinutes()}</h3>
            <p className="mt-2 text-sm font-semibold cursor-pointer text-secondary2">We are coming back soon!</p>
        </div>
    );
}

export default MaintenanceError;