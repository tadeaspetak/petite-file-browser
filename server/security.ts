import crypto from "crypto";

export const generateToken = async (): Promise<string> =>
  new Promise((resolve, reject) => {
    crypto.randomBytes(32, (err, buffer) => (err ? reject(err) : resolve(buffer.toString("hex"))));
  });

export const hashPassword = async (password: string) => {
  const iterations = 16384; // whatever you pick, it must be a power of two
  const salt = await generateToken();
  const hash = getPasswordHash(password, salt, iterations);

  return { hash, iterations, salt };
};

export const getPasswordHash = (password: string, salt: string, iterations: number): string =>
  crypto.scryptSync(password, salt, 64, { N: iterations }).toString("hex");
