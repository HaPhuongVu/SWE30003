import { Product } from "./product";


class Order {
    id: string;
    customerId: string;
    orderDate: Date;
    items: Map<Product, number>;
    payment: null;
    shipment: null;
    status: string;
    cancellation: boolean;

    observers: [];

    constructor() {
        this.id = "";
        this.customerId = "";
        this.orderDate = new Date();
        this.items = new Map<Product, number>();
        this.payment = null;
        this.shipment = null;
        this.status = "Pending";
        this.cancellation = false;
    }

    addItem(product: Product, quantity: number): void {
        if (this.items.has(product)) {
            this.items.set(product, this.items.get(product)! + quantity);
        } else {
            this.items.set(product, quantity);
        }
    }

    removeItem(product: Product): void {
        this.items.delete(product);
    }

    updateItemQuantity(product: Product, quantity: number): void {
        if (this.items.has(product)) {
            this.items.set(product, quantity);
        }
    }

    getDetails(): { id: string; customerId: string; orderDate: Date; items: Map<Product, number>; payment: null; shipment: null; status: string; cancellation: boolean } {
        return {
            id: this.id,
            customerId: this.customerId,
            orderDate: this.orderDate,
            items: this.items,
            payment: this.payment,
            shipment: this.shipment,
            status: this.status,
            cancellation: this.cancellation
        };
    }

    calculateTotal(): number {
        let total = 0;
        this.items.forEach((quantity, product) => {
            total += product.price * quantity;
        });
        if (this.payment) {
            // Assuming payment has a method to get the total amount
            // total += this.payment?.getTotalAmount() || 0;
            total += 0;
        }
        if (this.shipment) {
            // Assuming shipment has a method to get the shipping cost
            // total += this.shipment?.getShippingCost() || 0;
            total += 0;
        }
        return total;
    }

    setPayment(payment: null): void {
        this.payment = payment;
    }

    setShipment(shipment: null): void {
        this.shipment = shipment;
    }

    setStatus(status: string): void {
        this.status = status;
    }

    isCancellable(): boolean {
        return new Date().getTime() - this.orderDate.getTime() < 5 * 24 * 60 * 60 * 1000; // 5 days
    }

    getReceipt(): void {
        return;
    }

    attachObserver(observer: any): void {
        this.observers.push(observer);
    }

    detachObserver(observer: any): void {
        this.observers = this.observers.filter(obs => obs !== observer);
    }

    notifyObservers(): void {
        this.observers.forEach(observer => observer.update(this));
    }
}