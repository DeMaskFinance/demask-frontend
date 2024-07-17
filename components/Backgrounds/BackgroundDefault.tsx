interface BackgroundDefault {
  children: React.ReactNode;
}

export default function BackgroundDefault({ children }: BackgroundDefault) {
  return (
    <div className="relative w-full h-full min-h-[94vh]">
      <div className="w-[655px] h-[150px] bg-linear-g2 absolute top-0 right-1/4 blur-[100px] opacity-20 rounded-full rotate-25 -z-10"></div>
      {children}
    </div>
  );
}
