import database from "infra/database";
import {
  ValidationError,
  passwordValidationError,
  usernameValidationError,
  emailValidationError,
  missingFieldsError,
} from "infra/errors";
import { passwordService } from "models/password";

type UserData = {
  user_name: string;
  email: string;
  password: string;
};

type ValidationResponse = {
  statusCode: number;
  action: string;
  toJSON(): {
    statusCode: number;
    message?: string;
    action: string;
  };
};

const MIN_USERNAME_LENGTH = 4;
const MIN_PASSWORD_LENGTH = 10;

export type UserType = {
  user_name: string;
  email: string;
  password: string;
};

async function createUser(userData: UserType) {
  const validation = validateUser(userData);

  if (validation instanceof ValidationError) {
    return validation;
  }

  const hashedPassword = passwordService.hashPassword(userData.password);

  const user = await database.query({
    text: "INSERT INTO users (user_name, email, password) VALUES ($1, $2, $3) RETURNING *",
    values: [userData.user_name, userData.email, hashedPassword],
  });

  return user.rows[0];
}

async function getUserByUserName(userName: string) {
  const user = await database.query({
    text: "SELECT * FROM users WHERE user_name = $1",
    values: [userName],
  });

  return user.rows[0];
}

async function getUserById(userId: string) {
  const user = await database.query({
    text: "SELECT user_name, email FROM users WHERE id = $1",
    values: [userId],
  });

  return user.rows[0];
}

function validateUser(userData: UserData): ValidationResponse {
  const { user_name, email, password } = userData;
  let validation: ValidationResponse = {
    statusCode: 201,
    action: "ok",
    toJSON() {
      return {
        statusCode: this.statusCode,
        action: this.action,
      };
    },
  };

  const emptyFieldsValidation = validateEmptyFields(userData);
  if (emptyFieldsValidation) {
    return emptyFieldsValidation;
  }

  const userNameValidation = validateUserName(user_name);
  if (userNameValidation) {
    return userNameValidation;
  }

  const passwordValidation = validatePassword(password);
  if (passwordValidation) {
    return passwordValidation;
  }

  const emailValidation = validateEmail(email);
  if (emailValidation) {
    return emailValidation;
  }

  return validation;
}

const validatePassword = (password: string): ValidationResponse | void => {
  if (password.length < MIN_PASSWORD_LENGTH) {
    return new ValidationError({
      message: passwordValidationError(MIN_PASSWORD_LENGTH),
      code: "VALIDATION_ERROR",
    });
  }
};

const validateEmptyFields = (userData: UserData): ValidationResponse | void => {
  const { user_name, email, password } = userData;
  const emptyFields = [];
  if (!user_name) emptyFields.push("user_name");
  if (!email) emptyFields.push("email");
  if (!password) emptyFields.push("password");

  if (emptyFields.length > 0) {
    const errorMessage = missingFieldsError(emptyFields.join(", "));
    return new ValidationError({
      message: errorMessage,
      code: "VALIDATION_ERROR",
    });
  }
};

const validateUserName = (user_name: string): ValidationResponse | void => {
  if (user_name.length < MIN_USERNAME_LENGTH) {
    const validationError = new ValidationError({
      message: usernameValidationError(MIN_USERNAME_LENGTH),
      code: "VALIDATION_ERROR",
    });
    return validationError;
  }
};

const validateEmail = (email: string): ValidationResponse | void => {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  if (!emailRegex.test(email)) {
    const validationError = new ValidationError({
      message: emailValidationError(),
      code: "VALIDATION_ERROR",
    });
    return validationError;
  }
};

export const userService = {
  createUser,
  getUserByUserName,
  getUserById,
};
