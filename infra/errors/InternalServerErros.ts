export class InternalServerError extends Error {
  statusCode: number;
  cause: Error;
  action: string;

  constructor({ cause }: { cause: Error }) {
    super("Internal Server Error");
    this.name = "InternalServerError";
    this.statusCode = 500;
    this.action = "Please try again later.";
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
