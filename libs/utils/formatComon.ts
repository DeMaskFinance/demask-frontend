// format number to K,B,M,T ex:1000->1k
const formatToUnit = (number: string) => {
  const n = Number(number);
  if (n < 0.001) return "<0.001";
  if (n < 1e3) return n.toFixed(2);
  if (n >= 1e3 && n < 1e6) return +(n / 1e3).toFixed(1) + "K";
  if (n >= 1e6 && n < 1e9) return +(n / 1e6).toFixed(1) + "M";
  if (n >= 1e9 && n < 1e12) return +(n / 1e9).toFixed(1) + "B";
  if (n >= 1e12 && n < 1e15) return +(n / 1e12).toFixed(1) + "T";
  if (n >= 1e15 && n < 1e18) return +(n / 1e15).toFixed(1) + "Q";
  if (n >= 1e18 && n < 1e21) return +(n / 1e18).toFixed(1) + "S";
  if (n >= 1e21 && n < 1e24) return +(n / 1e21).toFixed(1) + "S";
  if (n >= 1e24 && n < 1e27) return +(n / 1e24).toFixed(1) + "O";
  if (n >= 1e27 && n < 1e30) return +(n / 1e27).toFixed(1) + "N";
  if (n >= 1e30 && n < 1e33) return +(n / 1e30).toFixed(1) + "D";
  if (n >= 1e33 && n < 1e35) return +(n / 1e33).toFixed(1) + "U";
  if (n >= 1e35) return +(n / 1e35).toFixed(1) + "D";
};
const formatPercent = (number: string | number) => {
  const n = Math.abs(Number(number));
  if (n <= 0.1) {
    return "0";
  } else {
    return n.toFixed(2);
  }
};
// const ipfsGateway = "https://cf-ipfs.com/ipfs/";
const ipfsGateway = "https://ipfs-gw.demask.finance/ipfs/";
const formatLinkIPFS = (link: string) => {
  return link?.replace("ipfs://", ipfsGateway);
};
const formatDate = (timestamp: number): string => {
  const secondsInDay = 86400; // 24 * 60 * 60
  const secondsInHour = 3600; // 60 * 60
  const secondsInMinute = 60;

  const days = Math.floor(timestamp / secondsInDay);
  const hours = Math.floor((timestamp % secondsInDay) / secondsInHour);
  const minutes = Math.floor((timestamp % secondsInHour) / secondsInMinute);
  const seconds = timestamp % secondsInMinute;

  return `${days}d ${hours.toString().padStart(2, "0")}h ${minutes
    .toString()
    .padStart(2, "0")}m ${seconds.toString().padStart(2, "0")}s`;
};
function formatTimestamp(timestamp: number): string {
  const date = new Date(timestamp * 1000);
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Asia/Ho_Chi_Minh", // GMT+7
    hour12: true,
  };

  const formattedDate = new Intl.DateTimeFormat("en-US", options).format(date);

  return `${formattedDate} GMT+7`;
}
const formatTypeChain = (type: String): String => {
  if (type === "erc1155") {
    return "ERC-1155";
  }
  return "ERC-721";
};
const briefDocument = (doc: String, start: number, end: number) => {
  return `${doc.slice(0, start)}...${doc.slice(-end)}`;
};
const replaceDot = (numString: string): string => {
  const replaced = numString.replace(/,/, ".");
  return replaced;
};
export {
  formatToUnit,
  formatPercent,
  formatLinkIPFS,
  formatDate,
  formatTimestamp,
  formatTypeChain,
  briefDocument,
  replaceDot,
};
