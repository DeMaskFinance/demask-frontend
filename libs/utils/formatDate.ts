import { useEffect, useState } from "react";

export const formatDate = (timeStamp: any) => {
  const [formattedDate, setFormattedDate] = useState("");

  useEffect(() => {
    const date = new Date(timeStamp * 1000); // Convert Unix timestamp to milliseconds
    const day = String(date.getDate()).padStart(2, "0"); // Get the day and pad with leading zero if necessary
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Get the month (months are 0-based) and pad with leading zero if necessary
    const year = date.getFullYear(); // Get the full year

    const formatted = `${day}-${month}-${year}`;
    setFormattedDate(formatted);

    return () => {
      // Cleanup if needed
    };
  }, [timeStamp]);

  return formattedDate;
};
