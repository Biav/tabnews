export class MethodNotAllowed extends Error {
  statusCode: number;
  action: string;

  constructor() {
    super("Method Not Allowed");
    this.name = "MethodNotAllowed";
    this.statusCode = 405;
    this.action = "Please check the allowed methods for this endpoint.";
  }

  toJSON() {
    return {
      statusCode: this.statusCode,
      message: this.message,
      action: this.action,
    };
  }
}
