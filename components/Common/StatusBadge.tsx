import { formatDate } from "@/libs/utils/formatComon";

interface StatusBadgeProps {
  status: StatusType;
  endTime: number;
  startTime: number;
}
const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  endTime,
  startTime,
}) => {
  const renderBadge = () => {
    switch (status) {
      case "Live":
        return (
          <div className="relative hidden md:flex items-center justify-between w-full h-10 px-3 font-semibold rounded-lg bg-green2 bg-opacity-10 text-green2 text-sm">
            <div className="flex items-center gap-x-1 font-bold">
              <div className="relative flex w-2 h-2">
                <span className="absolute inline-flex w-full h-full rounded-full opacity-75 animate-ping bg-green"></span>
                <span className="relative inline-flex w-2 h-2 rounded-full bg-green2"></span>
              </div>
              LIVE
            </div>
            <div className="text-white">
              {formatDate(endTime - Math.floor(Date.now() / 1000))}
            </div>
          </div>
        );
      case "Coming Soon":
        return (
          <div className="relative hidden md:flex items-center justify-between w-full h-10 px-3 font-semibold rounded-lg bg-yellow bg-opacity-10 text-yellow text-sm">
            <div className="flex items-center gap-x-1 font-bold">
              <div className="relative flex w-2 h-2">
                <span className="absolute inline-flex w-full h-full rounded-full opacity-75 animate-ping bg-yellow"></span>
                <span className="relative inline-flex w-2 h-2 rounded-full bg-yellow bg-opacity-75"></span>
              </div>
              UPCOMING
            </div>
            <div className="text-white">
              {formatDate(startTime - Math.floor(Date.now() / 1000))}
            </div>
          </div>
        );
      case "Ended":
        return (
          <div className="relative hidden md:flex items-center justify-between w-full h-10 px-3 font-semibold rounded-lg bg-shader_500 text-sm text-shader_200">
            <div className="flex items-center gap-x-1 font-bold">FINISHED</div>
          </div>
        );
      default:
        return null;
    }
  };

  return <>{renderBadge()}</>;
};

export default StatusBadge;
