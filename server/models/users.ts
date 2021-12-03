import { getPasswordHash, hashPassword } from "../security";

export interface User {
  name: string;
  email: string;
  passwordHash: string;
  salt: string;
  iterations: number;
}

export class Users {
  static data: { [key: string]: User } = {};

  static findAll(): User[] {
    return Object.values(this.data);
  }
  static findByEmail(email: string): User | undefined {
    return this.data[email];
  }
  static verifyPassword(password: string, user: User) {
    return getPasswordHash(password, user.salt, user.iterations) === user.passwordHash;
  }
  static async seed(inputs: { name: string; email: string; password: string }[]) {
    for (const input of inputs) {
      const { hash, iterations, salt } = await hashPassword(input.password);

      this.data[input.email] = {
        email: input.email,
        iterations,
        name: input.name,
        passwordHash: hash,
        salt,
      };
    }
  }
}
