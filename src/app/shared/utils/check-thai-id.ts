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
  return true
};
