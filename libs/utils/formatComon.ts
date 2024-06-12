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
const formatPercent = (number: string) => {
  const n = Math.abs(Number(number));
  if (n <= 0.1) {
    return "0";
  } else {
    return n.toFixed(2);
  }
};
const ipfsGateway = "https://cf-ipfs.com/ipfs/";
const formatLinkIPFS = (link: string) => {
  return link?.replace("ipfs://", ipfsGateway);
};
const formatDate = (timestamp: number): string => {
  const date = new Date(timestamp * 1000);
  const formattedDate =
    [
      ("0" + date.getDate()).slice(-2), // Day
      ("0" + (date.getMonth() + 1)).slice(-2), // Month
      date.getFullYear(), // Year
    ].join("/") +
    " " +
    [
      ("0" + date.getHours()).slice(-2), // Hours
      ("0" + date.getMinutes()).slice(-2), // Minutes
    ].join(":");

  return formattedDate;
};
const formatTypeChain = (type: String) => {
  if (type === "erc1155") {
    return "ERC-1155";
  }
  return "ERC-721";
};
export {
  formatToUnit,
  formatPercent,
  formatLinkIPFS,
  formatDate,
  formatTypeChain,
};
