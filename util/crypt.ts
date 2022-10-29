import {
  Cipher,
  createCipheriv,
  createDecipheriv,
  Encoding,
  randomBytes,
} from "crypto";

const key = process.env.CRYPT_KEY!;
const initVector = process.env.CRYPT_INIT!;
function crypt(
  cipher: Cipher,
  data: any,
  inputType: Encoding,
  outputType: BufferEncoding
) {
  return Buffer.concat([
    cipher.update(data, inputType),
    cipher.final(),
  ]).toString(outputType);
}

export function encrypt(
  data: any,
  inputType: Encoding = "utf8",
  outputType: BufferEncoding = "base64"
) {
  return crypt(
    createCipheriv("aes-256-ctr", key, randomBytes(16)),
    data,
    inputType,
    outputType
  );
}

export function decrypt(
  data: any,
  inputType: Encoding = "base64",
  outputType: BufferEncoding = "utf8"
) {
  crypt(
    createDecipheriv("aes-256-ctr", key, randomBytes(16)),
    data,
    inputType,
    outputType
  );
}
