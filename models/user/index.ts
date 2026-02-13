import database from "infra/database";

export type UserType = {
  user_name: string;
  email: string;
  password: string;
};

async function createUser(userData: UserType) {
  const user = await database.query({
    text: "INSERT INTO users (user_name, email, password) VALUES ($1, $2, $3) RETURNING *",
    values: [userData.user_name, userData.email, userData.password],
  });

  return user.rows[0];
}

export const userService = {
  createUser,
};
