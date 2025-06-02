import { Product } from "./product";
import { Payment } from "./payment";
import { Shipment } from "./shipment";
import { Customer } from "./customer";

class Receipt {
    orderId: string;
    customer: Customer;
    items: { product: Product, quantity: number, price: number }[];
    total: number;
    payment: Payment;
    shipment: Shipment;

    constructor(
        orderId: string,
        customer: Customer,
        items: { product: Product, quantity: number, price: number }[],
        total: number,
        payment: Payment,
        shipment: Shipment
    ) {
        this.orderId = orderId;
        this.customer = customer;
        this.items = items;
        this.total = total;
        this.payment = payment;
        this.shipment = shipment;
    }
}

export { Receipt };