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
}