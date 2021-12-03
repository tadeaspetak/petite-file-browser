declare namespace Express {
  export interface Request {
    user?: import("../server/models/users").User;
  }
}
