import { Logo404Page } from "@/components/Logo/Logo";
import { NextPageContext } from "next";
import { useRouter } from "next/navigation";
interface ErrorProps {
  statusCode: number;
  statusMessage: string;
}
function Error({ statusCode, statusMessage }: ErrorProps) {
  const router = useRouter();
  return (
    //   <p>
    //     {statusCode
    //       ? `An error ${statusCode} occurred on server`
    //       : 'An error occurred on client'}
    //   </p>
    <div className="flex flex-col items-center justify-center min-h-[94vh]">
      <h2 className="text-2xl font-semibold text-shader_700">
        {statusMessage}
      </h2>
      <div className="">
        <Logo404Page width={492} height={376} className="w-full h-full" />
      </div>
      <h3 className="text-xl font-semibold text-shader_100">{statusCode}</h3>
      <p
        className="mt-2 text-sm font-semibold cursor-pointer text-primary_500"
        onClick={() => router.refresh()}
      >
        Try again
      </p>
    </div>
  );
}

Error.getInitialProps = ({ res, err }: NextPageContext) => {
  const statusCode = err ? err.statusCode : res ? res.statusCode : 404;
  const statusMessage = err
    ? err.message
    : res
    ? res.statusMessage
    : "Oops, something went wrong.";
  return { statusCode, statusMessage };
};

export default Error;
