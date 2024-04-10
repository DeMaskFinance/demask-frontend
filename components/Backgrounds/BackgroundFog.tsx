import Image from "next/image";

interface BackgroundDefault {
  children: React.ReactNode;
}

export default function BackgroundDefault({ children }: BackgroundDefault) {
  return (
    <div className="w-full h-full overflow-hidden">
      <div>
        <Image
          src="/public/logo.png"
          alt="bg-default"
          width={1200}
          height={1200}
        />
      </div>
      {children}
    </div>
  );
}
