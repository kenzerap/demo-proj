export const thaiIdCheck = (idCardNumber: string | number): boolean => {
  if (typeof idCardNumber === 'number') {
    idCardNumber = idCardNumber.toString();
  }

  const regex = /^[0-9]\d*$/;
  if (
    idCardNumber.length === 13 &&
    idCardNumber.match(regex) &&
    idCardNumber !== null &&
    idCardNumber !== 'undefined'
  ) {
    // Check valid id card number
    return idCardCheck(idCardNumber);
  } else {
    return false;
  }
};

const idCardCheck = (idCardNumber: string) => {
  var sum = 0;
  for (var i = 0; i < idCardNumber.length - 1; i++) {
    sum += parseInt(idCardNumber[i]) * (13 - i);
  }

  var checkDigit = (11 - (sum % 11)) % 10;

  if (checkDigit.toString() == idCardNumber[12]) {
    return true;
  } else {
    return false;
  }
};
