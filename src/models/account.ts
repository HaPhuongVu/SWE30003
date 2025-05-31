abstract class Account {
  id: string;
  username: string;
  hashedPassword: string;

  constructor(id: string, username: string, hashedPassword: string) {
    this.id = id;
    this.username = username;
    this.hashedPassword = hashedPassword;
  }

}

export { Account };