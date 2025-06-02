import type { Cart } from "./cart";

/**
 * Represents a user account in the system.
 */
class Account {
  id: string;
  username: string;
  fullname: string;
  email: string;
  password: string;
  role: string = 'customer';
  address?: string;
  phoneNumber?: string;
  cart?: Cart;

  /**
   * Creates an instance of Account.
   * @param id - Unique identifier for the account.
   * @param username - Username for the account.
   * @param fullname - Full name of the account holder.
   * @param email - Email address associated with the account.
   * @param password - Password for the account.
   */
  constructor(id: string, username: string, fullname: string, email: string, password: string) {
    this.id = id;
    this.username = username;
    this.fullname = fullname;
    this.email = email;
    this.password = password;
  }

}

export { Account };