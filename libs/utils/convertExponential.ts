export function exponentialToDecimal(scientificNumber:number) {
  return scientificNumber.toLocaleString("fullwide", { useGrouping: false });
}
