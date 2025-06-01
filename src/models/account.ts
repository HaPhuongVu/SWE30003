abstract class Account {
  id: string;
  username: string;
  fullname: string;
  email: string;
  password: string;
  phoneNumber: string;
  address: string

  constructor(id: string, username: string, fullname: string, email: string, password: string) {
    this.id = id;
    this.username = username;
    this.fullname = fullname
    this.email = email;
    this.password = password;
    this.phoneNumber = ""
    this.address = ""
  }

}

export { Account };