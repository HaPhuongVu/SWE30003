import { Product } from "./product";
import { Payment } from "./payment";
import { Shipment } from "./shipment";
import type { NotificationObserver } from "./notification-observer";

type OrderJSON = {
    id: string;
    userId: string;
    orderDate: string;
    items: { productId: string; quantity: number }[];
    paymentId: string;
    shipmentId: string;
    status: string;
    cancellation: boolean;
}

class Order {
    id?: string;
    userId: string;
    orderDate: Date;
    items: {product: Product, quantity: number}[];
    payment?: Payment;
    shipment?: Shipment;
    status: string;
    cancellation: boolean;

    observers: NotificationObserver[] = [];

    constructor(
        userId: string,
        id?: string,
        orderDate?: Date,
        items?: { product: Product; quantity: number }[],
        payment?: Payment,
        shipment?: Shipment,
        status?: string,
        cancellation?: boolean
    ) {
        this.userId = userId;
        this.id = id;
        this.orderDate = orderDate ? new Date(orderDate) : new Date();
        this.items = items ? items : [];
        this.payment = payment;
        this.shipment = shipment;
        this.status = status ? status : "Pending";
        this.cancellation = cancellation ? cancellation : false;
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
        this.notify(`Order status updated to ${status}`);
    }

    getTotalPrice() {
        const subtotal = this.items.reduce((total, item) => total + item.product.price * item.quantity, 0);
        return subtotal + (this.shipment ? this.shipment.fee : 0);
    }

    verify() {
        return this.payment && this.shipment && this.id;
    }

    isCancellable() {
        return this.status === "Pending" && new Date().getTime() - this.orderDate.getTime() < 3 * 24 * 60 * 60 * 1000;
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

export { Order, type OrderJSON };