const sign = num => num < 0 || Object.is(num, -0) ? 1 : 0;
const maxExponent = 11;
const maxExponentValue = Math.floor((2**maxExponent)/2) - 1;
const maxMantissaLength = 52;

const getBinaryIntegerString = (num) => {
  if (num === 0) return '0';
  let binaryIntegerString = '';
  let integerPart = Math.trunc(Math.abs(num));
  let index = 0;
  while(integerPart >= 1 && index < maxExponentValue + 1) {
    binaryIntegerString = `${integerPart % 2 ? 1 : 0}${binaryIntegerString}`;
    integerPart = Math.trunc(integerPart/2);
    index++;
  }
  return binaryIntegerString;
}

const getBinaryFractionString = (num) => {
  let binaryDecimalString = '';
  let fractionalPart = Math.abs(num) % 1;
  let index = 0;
  while(fractionalPart !== 1 && index < (maxExponentValue + maxMantissaLength - 1)) {
    fractionalPart = fractionalPart*2;
    binaryDecimalString = `${binaryDecimalString}${Math.trunc(fractionalPart) === 1 ? 1 : 0}`;
    if (fractionalPart > 1) fractionalPart -= 1;
    index++;
  }
  return binaryDecimalString;
}

const generateMantissaAndExponent = (num) => {
  if (num === 0) return {
    exponent: ''.padStart(maxExponent, '0'),
    mantissa: ''.padStart(maxMantissaLength, 0),
  }
  if (Math.abs(num) === Infinity) return {
    exponent: ''.padStart(maxExponent, '1'),
    mantissa: ''.padStart(maxMantissaLength, 0),
  }
  if (isNaN(num)) return {
    exponent: ''.padStart(maxExponent, '1'),
    mantissa: '1'.padEnd(maxMantissaLength, 0),
  }

  let exponent;
  const binaryIntegerString = getBinaryIntegerString(num);
  const binaryFractionString = getBinaryFractionString(num);
  let rawMantissa = '';
  if (binaryIntegerString === '') {
    let mostSignificantBitDistance = binaryFractionString.search('1');
    mostSignificantBitDistance = mostSignificantBitDistance === -1 ? 1022 : mostSignificantBitDistance;
    if (mostSignificantBitDistance > maxExponentValue) {
      exponent = 0;
      rawMantissa = binaryFractionString.slice(maxExponentValue - 2, binaryFractionString.length);
      console.log(rawMantissa.length)
    } else {
      exponent = maxExponentValue - (mostSignificantBitDistance + 1);
      rawMantissa = binaryFractionString.slice(mostSignificantBitDistance, binaryFractionString.length);  
    }
  } else {
    exponent = maxExponentValue + (binaryIntegerString.length - 1);
    rawMantissa = binaryIntegerString.slice(0, binaryIntegerString.length) + binaryFractionString;
  }
  const mantissa = rawMantissa.slice(1, maxMantissaLength + 1).padEnd(maxMantissaLength, '0');

  return {
    exponent: getBinaryIntegerString(exponent).padStart(maxExponent, '0'),
    mantissa,
  }
}

numToIEEE_754 = (num) => {
  console.log(num.toString())
  const { exponent, mantissa } = generateMantissaAndExponent(num);
  return `${sign(num)} ${exponent} ${mantissa}`;
};
