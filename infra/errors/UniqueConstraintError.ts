export class UniqueConstraintError extends Error {
  statusCode: number;
  action: string;
  code: string;

  constructor(pgError: any) {
    super(pgError.message);
    this.name = "UniqueConstraintError";
    this.statusCode = 409;
    this.code = pgError.code;
    this.action = "This value already exists. Please use a different value.";
  }

  toJSON() {
    return {
      statusCode: this.statusCode,
      message: this.message,
      action: this.action,
    };
  }
}
