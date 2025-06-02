import { Account } from './account';
import { Cart } from './cart';

type CustomerDetails = {
  personal: { phone: string | undefined };
  delivery: { address: string | undefined };
  payment: { cardNumber: string | undefined; expiryDate: string | undefined };
};

class Customer extends Account {

  details: CustomerDetails;

  shoppingCart: Cart;

  constructor(id: string, username: string, fullname: string, email: string, password: string, details: CustomerDetails) {
    super(id, username, fullname, email, password);
    this.details = details;
    this.shoppingCart = new Cart(this.id);
  }

  getRole(): string {
    return 'customer';
  }
}

export { Customer };
