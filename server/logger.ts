export class Logger {
  static error(...items: any[]) {
    if (process.env.NODE_ENV !== "test") {
      console.error.apply(null, items); // eslint-disable-line no-console
    }
  }
}
