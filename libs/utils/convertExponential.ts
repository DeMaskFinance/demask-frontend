export function exponentialToDecimal(scientificNumber:number) {
  return scientificNumber.toLocaleString("fullwide", { useGrouping: false });
}
export function toFixed(x: number): string {
  let result = '';
  if (Math.abs(x) < 1.0) {
    let e = parseInt(x.toString().split('e-')[1]);
    if (e) {
        x *= Math.pow(10,e-1);
        result = '0.' + (new Array(e)).join('0') + x.toString().substring(2);
    } else {
        result = x.toString();
    }
  } else {
    let e = parseInt(x.toString().split('+')[1]);
    if (e > 20) {
        e -= 20;
        x /= Math.pow(10,e);
        result = x.toString() + (new Array(e+1)).join('0');
    } else {
        result = x.toString();
    }
  }
  return result;
}
