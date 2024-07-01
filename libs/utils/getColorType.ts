export const getColorType = (action: String) => {
  if (action === "Buy") {
    return "bg-green text-green";
  } else if (action === "Add" || action === "Referee") {
    return "bg-primary_300 text-primary_300";
  } else if (action === "Referral") {
    return "bg-blue text-blue";
  } else {
    return "bg-red text-red";
  }
};
