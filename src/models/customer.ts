import { Account } from './account';
import { Cart } from './cart';

class Customer extends Account {

  details: {
    personal: { phone: string | undefined };
    delivery: { address: string | undefined };
    payment: { cardNumber: string | undefined; expiryDate: string | undefined };
  };

  shoppingCart: Cart;

  constructor(id: string, username: string, fullname: string, email: string, password: string, details: any) {
    super(id, username, fullname, email, password);
    this.details = details;
    this.shoppingCart = new Cart(this.id);
  }

  getRole(): string {
    return 'customer';
  }
}

export { Customer };
