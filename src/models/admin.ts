import { Account } from './account';

class Admin extends Account {
  getRole() {
    return 'admin';
  }
}

export { Admin };