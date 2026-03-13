import Chance from "chance";

const chance = new Chance();

class UserBuilder {
  private user_name: string;
  private email: string;
  private password: string;

  constructor() {
    this.user_name = chance.name();
    this.email = chance.email();
    this.password = chance.guid();
  }

  withUserName(user_name: string) {
    this.user_name = user_name;
    return this;
  }

  withEmail(email: string) {
    this.email = email;
    return this;
  }

  withPassword(password: string) {
    this.password = password;
    return this;
  }

  build() {
    return {
      user_name: this.user_name,
      email: this.email,
      password: this.password,
    };
  }
}

export default UserBuilder;
