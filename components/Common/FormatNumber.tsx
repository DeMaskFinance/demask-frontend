const FormatNumber = ({ number }: { number: string | number }) => {
  const roundedNumber = Number(number);
  const decimalPlaces = Math.max(
    0,
    -Math.floor(Math.log10(Math.abs(roundedNumber)) - 3)
  );
  let str = roundedNumber.toExponential();
  let splitStr = str.split("e");
  let firstFourDigits = Math.abs(
    Number(splitStr[0].replace(".", "").slice(0, 4))
  );
  let exponent = -splitStr[1];
  return (
    <div>
      {roundedNumber === 0 ? (
        <p>0</p>
      ) : roundedNumber < 1e-5 ? (
        <div>
          0.0
          <span className="text-[9px]">{exponent}</span>
          {firstFourDigits}
        </div>
      ) : roundedNumber >= 1e-5 && roundedNumber < 1 ? (
        <p>{parseFloat(roundedNumber.toFixed(decimalPlaces)).toString()}</p>
      ) : (
        <p>{Number(roundedNumber.toFixed(2)).toLocaleString("en-US")}</p>
      )}
    </div>
  );
};

export default FormatNumber;
