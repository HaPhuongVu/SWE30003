abstract class Account {
  id: string;
  username: string;
  hashedPassword: string;

  constructor(id: string, username: string, hashedPassword: string) {
    this.id = id;
    this.username = username;
    this.hashedPassword = hashedPassword;
  }

  verifyPassword(password: string): boolean {
    return this.hashedPassword === this.hashPassword(password);
  }

  hashPassword(password: string): string {
    return password;
  }

  getRole() {}
}

export { Account };