import { Product } from "./product";
import { Payment } from "./payment";
import { Shipment } from "./shipment";
import { Receipt } from "./receipt";
import { Customer } from "./customer";
import type { NotificationObserver } from "./notification-observer";

class Order {
    id: string;
    customer: Customer;
    orderDate: Date;
    items: {product: Product, quantity: number}[];
    payment?: Payment;
    shipment?: Shipment;
    status: string;
    cancellation: boolean;

    observers: NotificationObserver[] = [];

    constructor(customer: Customer) {
        this.id = "";
        this.customer = customer;
        this.orderDate = new Date();
        this.items = [];
        this.payment = undefined;
        this.shipment = undefined;
        this.status = "Pending";
        this.cancellation = false;
    }

    addItem(product: Product, quantity: number) {
        this.items.push({ product, quantity });
    }

    removeItem(productId: string) {
        this.items = this.items.filter(item => item.product.id !== productId);
    }

    updateItemQuantity(productId: string, quantity: number) {
        const item = this.items.find(item => item.product.id === productId);
        if (item) {
            item.quantity = quantity;
        }
    }

    setPayment(payment: Payment) {
        this.payment = payment;
    }

    setShipment(shipment: Shipment) {
        this.shipment = shipment;
    }

    updateStatus(status: string) {
        this.status = status;
    }

    getTotalPrice() {
        const subtotal = this.items.reduce((total, item) => total + item.product.price * item.quantity, 0);
        return subtotal + (this.shipment ? this.shipment.fee : 0);
    }

    verify() {
        return this.payment && this.shipment;
    }

    isCancellable() {
        return this.status === "Pending" && new Date().getTime() - this.orderDate.getTime() < 3 * 24 * 60 * 60 * 1000; // 72 hours
    }

    generateReceipt() {
        if (!this.verify()) {
            throw new Error("Order is not valid");
        }

        const receipt = new Receipt(
            this.id,
            this.customer,
            this.items.map(item => ({
                product: item.product,
                quantity: item.quantity,
                price: item.product.price * item.quantity
            })),
            this.getTotalPrice(),
            this.payment!,
            this.shipment!
        );

        return receipt;
    }

    subscribe(observer: NotificationObserver) {
        this.observers.push(observer);
    }

    unsubscribe(observer: NotificationObserver) {
        this.observers = this.observers.filter(obs => obs !== observer);
    }

    notify(message: string) {
        this.observers.forEach(observer => observer.update(message));
    }

}

export { Order };