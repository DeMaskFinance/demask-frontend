import { LogoMaintenance } from "@/components/Logo/Logo";
import { TbWorldX } from "react-icons/tb";

export default function () {
    return (
        <div className="flex flex-col items-center justify-center min-h-[94vh]">
            <h2 className="text-3xl flex items-center gap-1 font-semibold title text-[#F4A254]">
                <span><TbWorldX /></span>Country restricted
            </h2>
            <div className="my-8">
                <LogoMaintenance width={350} height={288} className="w-full h-full" />
            </div>

            <p className="mt-2 text-xl font-semibold italic cursor-pointer text-[#F4A254]">
                Sorry, our website is not available in your region due to legal and regulatory restrictions
            </p>
        </div>
    );
}

