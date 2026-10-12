import { userService } from "../user";
import { passwordService } from "models/password";
import { UnauthorizedError } from "infra/errors";

const getAuthenticatedUser = async (user_name: string, password: string) => {
  const user = await userService.getUserByUserName(user_name);

  if (!user) {
    throw new UnauthorizedError({ cause: new Error("User not found") });
  }

  const isPasswordValid = await passwordService.comparePasswords(
    password,
    user.password,
  );

  if (!isPasswordValid) {
    throw new UnauthorizedError({ cause: new Error("Invalid password") });
  }

  return user;
};

export { getAuthenticatedUser };
