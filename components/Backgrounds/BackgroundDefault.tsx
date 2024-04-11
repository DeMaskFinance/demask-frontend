import Image from "next/image";

interface BackgroundDefault {
  children: React.ReactNode;
}

export default function BackgroundDefault({ children }: BackgroundDefault) {
  return (
    <div className="relative w-full h-full overflow-hidden">
      <div className="absolute top-0 left-0 z-[-10]">
        <Image
          src="/bgDefault.svg"
          alt="bg-default"
          width={1200}
          height={1200}
          className="w-full h-full dark:color-red opacity-30 dark:brightness-[15%] dark:sepia-[10%]"
        />
      </div>
      {children}
    </div>
  );
}
