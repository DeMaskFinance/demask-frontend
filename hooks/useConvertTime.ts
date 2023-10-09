export const convertTime = (timestamp: any) => {
  const date = new Date(timestamp * 1000);
  const days = Math.floor(timestamp / (60 * 60 * 24));
  const hours = date.getUTCHours();
  const minutes = date.getUTCMinutes();
  const seconds = date.getSeconds();

  const formattedTime = `0${days}d ${hours}h ${minutes}m ${seconds}s`;
  return { days, hours, minutes, seconds };
};
