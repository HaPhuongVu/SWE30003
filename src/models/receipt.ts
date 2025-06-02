import { Product } from "./product";
import { Payment } from "./payment";
import { Shipment } from "./shipment";
import { Account } from "./account";

class Receipt {
    orderId: string;
    user: Account;
    items: { product: Product, quantity: number, price: number }[];
    total: number;
    payment: Payment;
    shipment: Shipment;

    constructor(
        orderId: string,
        user: Account,
        items: { product: Product, quantity: number, price: number }[],
        total: number,
        payment: Payment,
        shipment: Shipment
    ) {
        this.orderId = orderId;
        this.user = user;
        this.items = items;
        this.total = total;
        this.payment = payment;
        this.shipment = shipment;
    }
}

export { Receipt };