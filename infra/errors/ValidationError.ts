export const passwordValidationError = (MIN_PASSWORD_LENGTH: number) =>
  `Password must be at least ${MIN_PASSWORD_LENGTH} characters long.`;

export const usernameValidationError = (MIN_USERNAME_LENGTH: number) =>
  `Username must be at least ${MIN_USERNAME_LENGTH} characters long.`;

export const emailValidationError = () =>
  `Invalid email format. Please provide a valid email address.`;

export const missingFieldsError = (emptyFields: string) =>
  `Missing required fields: ${emptyFields}`;

export class ValidationError extends Error {
  statusCode: number;
  action: string;
  code: string;

  constructor(pgError: any) {
    super(pgError.message);
    this.name = "ValidationError";
    this.statusCode = 422;
    this.code = pgError.code;
    this.action =
      "Missing required fields. Please provide all necessary information.";
  }

  toJSON() {
    return {
      statusCode: this.statusCode,
      message: this.message,
      action: this.action,
    };
  }
}
