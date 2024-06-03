import { Logo404Page } from "@/components/Logo/Logo";
import { useRouter } from "next/navigation";
export default function NotFound() {
  const router = useRouter();
  return (
    <div className="flex flex-col items-center justify-center min-h-[94vh]">
      <h2 className="text-2xl font-semibold text-shader_700">Oops!</h2>
      <div className="">
        <Logo404Page width={492} height={376} className="w-full h-full" />
      </div>
      <h3 className="text-xl font-semibold text-shader_600">Page not found</h3>
      <p
        className="mt-2 text-sm font-semibold cursor-pointer text-primary_500"
        onClick={() => router.refresh()}
      >
        Try again
      </p>
    </div>
  );
}
