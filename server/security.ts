import crypto from "crypto";

export const generateToken = async (): Promise<string> =>
  new Promise((resolve, reject) => {
    crypto.randomBytes(32, (err, buffer) => (err ? reject(err) : resolve(buffer.toString("hex"))));
  });

const unsafeRandomNumber = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min)) + min;

export const hashPassword = async (password: string) => {
  const iterations = unsafeRandomNumber(20000, 10000);
  const salt = await generateToken();
  const hash = getPasswordHash(password, salt, iterations);

  return { hash, iterations, salt };
};

export const getPasswordHash = (password: string, salt: string, iterations: number) =>
  crypto.pbkdf2Sync(password, salt, iterations, 64, "sha512").toString("hex");

export const verifyPassword = async (password: string) => {
  const iterations = unsafeRandomNumber(20000, 10000);
  const salt = await generateToken();
  const hash = crypto.pbkdf2Sync(password, salt, iterations, 64, "sha512").toString("hex");

  return { hash, iterations, salt };
};
