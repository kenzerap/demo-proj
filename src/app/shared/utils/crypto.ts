import * as CryptoJS from 'crypto-js';

export const hashString = (dataString: string): string => {
  return CryptoJS.SHA256(dataString).toString(CryptoJS.enc.Base64);
};

export const decryptData = (dataEncrypted: string, secretKey: string): string => {
  const bytes = CryptoJS.AES.decrypt(
    dataEncrypted,
    CryptoJS.enc.Utf8.parse(secretKey),
    {
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7,
    }
  );

  return bytes.toString(CryptoJS.enc.Utf8);
};
