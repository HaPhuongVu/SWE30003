
class Order {
    id: string;
    customerId: string;
    orderDate: Date;
    items: {productId: string, quantity: number}[];
    totalBill: number;
    payment: string;
    shipment: string;
    status: string;
    cancellation: boolean;


    constructor() {
        this.id = "";
        this.customerId = "";
        this.orderDate = new Date();
        this.items = [];
        this.totalBill = 0
        this.payment = "";
        this.shipment = "";
        this.status = "Pending";
        this.cancellation = false;
    }
}

export {Order}