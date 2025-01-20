export class AuthenticationError extends Error {
  statusText: string;
  statusCode: number;
  constructor(message: string) {
    super(message);
    this.statusText = "Unauthenticated";
    this.statusCode = 401;
    this.name = "AuthenticationError";
  }
}
