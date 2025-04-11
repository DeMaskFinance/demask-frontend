import { CheckIcon } from "@radix-ui/react-icons";
import React from "react";
import { MdClose } from "react-icons/md";
import { TbLoader2 } from "react-icons/tb";

interface Step {
    title: string;
    content: string;
    border?: boolean;
}

interface LoadingStepsModalProps {
    isOpen: boolean;
    onClose: () => void;
    step: number;
    steps: Step[];
    heading?: string;
}

export default function LoadingStepsModal({
    isOpen,
    onClose,
    step,
    steps,
    heading = "Create your items",
}: LoadingStepsModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
            <div className="bg-[#1c1c1e] rounded-2xl shadow-lg w-full max-w-md mx-4 overflow-hidden">
                {/* Heading */}
                <div className="flex justify-between items-center p-4 border-b border-white/10">
                    <h2 className="text-white text-lg font-semibold">{heading}</h2>
                    <button onClick={onClose} className="text-white text-xl hover:text-primary_300">
                        <MdClose />
                    </button>
                </div>

                <div className="flex px-4 py-6">
                    <div className="flex flex-col items-center w-10 pt-1">
                        {steps.map((item, idx) => (
                            <div key={idx} className="flex flex-col items-center relative">
                                <div
                                    className={`w-8 h-8 rounded-full border-2 flex items-center justify-center ${step > idx
                                        ? "border-primary_500 text-primary_200 bg-primary_500/30"
                                        : "border-gray-500 bg-[#3F3F46] text-white"
                                        }`}
                                >
                                    {step > idx ? (
                                        <CheckIcon width={18} height={18} />
                                    ) : step === idx ? (
                                        <TbLoader2 className="w-4 h-4 animate-spin" />
                                    ) : null}
                                </div>

                                {item.border && (
                                    <div className="h-6 border-l ml-0.5 border-dashed border-gray-600 mt-1"></div>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Content */}
                    <div className="flex flex-col gap-6 pl-4 w-full">
                        {steps.map((item, idx) => (
                            <div key={idx}>
                                <p className="text-white font-medium text-sm">{item.title}</p>
                                <p
                                    className={`text-xs ${step > idx
                                        ? "text-primary_300"
                                        : step === idx
                                            ? "text-gray-400"
                                            : "text-gray-400"
                                        }`}
                                >
                                    {step > idx ? "Complete!" : item.content}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
