const FormatNumber = ({ number }: { number: string | number }) => {
  const roundedNumber = Number(number);

  const formatLargeNumber = (num: number) => {
    if (num >= 1e18) {
      return `${(num / 1e18).toFixed(2)}E`;
    } else if (num >= 1e15) {
      return `${(num / 1e15).toFixed(2)}P`;
    } else if (num >= 1e12) {
      return `${(num / 1e12).toFixed(2)}T`;
    } else if (num >= 1e9) {
      return `${(num / 1e9).toFixed(2)}B`;
    } else if (num >= 1e3) {
      return num.toLocaleString("en-US");
    } else if (num >= 1) {
      return num.toFixed(2);
    } else if (num >= 1e-5) {
      return num.toFixed(6);
    } else {
      return num.toExponential(2);
    }
  };


  const decimalPlaces = Math.max(
    0,
    -Math.floor(Math.log10(Math.abs(roundedNumber)) - 3)
  );

  return (
    <div>
      {roundedNumber === 0 ? (
        <p>0</p>
      ) : roundedNumber < 1e-5 ? (
        <div>
          0.0
          <span className="text-[9px]">{Math.floor(Math.log10(Math.abs(roundedNumber)))}</span>
          {roundedNumber.toExponential().slice(0, 4)}
        </div>
      ) : roundedNumber >= 1e3 && roundedNumber < 1e9 ? (
        <p>{roundedNumber.toLocaleString("en-US")}</p>
      ) : (
        <p>{formatLargeNumber(roundedNumber)}</p>
      )}
    </div>
  );
};

export default FormatNumber;
