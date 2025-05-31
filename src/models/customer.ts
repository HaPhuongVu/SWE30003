import { Account } from './account';
import { Cart } from './cart';

class Customer extends Account {

  details: {
    personal: { name: string; email: string | undefined; phone: string | undefined };
    delivery: { address: string | undefined };
    payment: { cardNumber: string | undefined; expiryDate: string | undefined };
  };

  shoppingCart: Cart;

  constructor(id: string, username: string, hashedPassword: string, details: any) {
    super(id, username, hashedPassword);
    this.details = details;
    this.shoppingCart = new Cart;
  }
}

export { Customer };
