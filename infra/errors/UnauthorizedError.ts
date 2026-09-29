export class UnauthorizedError extends Error {
  statusCode: number;
  cause: Error;
  action: string;

  constructor({ cause }: { cause: Error }) {
    super("Unauthorized");
    this.name = "UnauthorizedError";
    this.statusCode = 401;
    this.action = "Please check your credentials and try again.";
    this.cause = cause;
  }

  toJSON() {
    return {
      statusCode: this.statusCode,
      message: this.message,
      action: this.action,
      cause: this.cause.message,
    };
  }
}
