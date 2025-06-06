import { Order, type OrderJSON } from "../models/order";
import type { Product } from "../models/product";
import type { JointPayment, Payment } from "../models/payment";
import { Shipment, type JointShipment } from "../models/shipment";
import { OrderRepository } from "../repository/order-repository";
import { AccountController } from "./account-controller";
import { CartController } from "./cart-controller";
import { ShipmentController } from "./shipment-controller";
import { PaymentController } from "./payment-controller";
import { Receipt } from "../models/receipt";
import { ProductController } from "./product-controller";
import { CatalogueController } from "./catalogue-controller";
import { NotificationController } from "./notification-controller";

class OrderController {
    private static _instance: OrderController;

    private constructor() {}

    private generateReceiptText(receipt: Receipt):string {
        const lines = []
        lines.push("FROM: AWE Electronic Store")
        lines.push(`TO: ${receipt.user.fullname}`)
        lines.push("")
        lines.push("===Receipt===")
        lines.push(`Order ID: ${receipt.orderId.id}`)
        lines.push(`Order Date: ${receipt.orderId.orderDate.toLocaleDateString()}`)
        lines.push("")
        lines.push("===Contact Information===")
        lines.push(`Email: ${receipt.user.email}`)
        lines.push(`Phone Number: ${receipt.user.phoneNumber ? receipt.user.phoneNumber : "No information"}`)
        lines.push(`Address: ${receipt.user.address}`)
        lines.push("")
        lines.push("===Order===")
        lines.push("")
        receipt.items.forEach((item, index) => {
            lines.push(`${index+1}.     ${item.product.name}  x  ${item.quantity}     $${(item.price * item.quantity).toFixed(2)}`)
        })
        lines.push("")
        lines.push(`Total Paid: $${receipt.total.toFixed(2)}`)
        {receipt.payment.type === 'card' ? (
        lines.push(`Pay through: ${receipt.payment?.paymentGateway} ${receipt.payment.type} (${receipt.payment?.cardNumber})`)
        ) : (
            lines.push(`Pay through: ${receipt.payment?.type} `)
        )}
        lines.push(`Shipping method: ${receipt.shipment.type}`)
        return lines.join("\n")
    }

    static get instance(): OrderController {
        if (!OrderController._instance) {
            OrderController._instance = new OrderController();
        }
        return OrderController._instance;
    }

    async parseOrderJSON(orderjson: OrderJSON): Promise<Order> {
        return new Order(
            orderjson.userId,
            orderjson.id,
            new Date(orderjson.orderDate),
            await Promise.all(
                orderjson.items.map(async item => {
                    const product = await ProductController.instance.getProduct(item.productId);
                    if (!product) {
                        throw new Error(`Product not found: ${item.productId}`);
                    }
                    return {
                        product,
                        quantity: item.quantity
                    };
                })
            ),
            await PaymentController.instance.getPaymentById(orderjson.paymentId),
            await ShipmentController.instance.getShipmentById(orderjson.shipmentId),
            orderjson.status,
            orderjson.cancellation
        );
    }

    async createOrder(
        userId: string,
        products: { product: Product; quantity: number }[],
        payment: Payment,
        shipment: Shipment
    ): Promise<Order> {
        const items = products.map(item => ({
            productId: item.product.id,
            quantity: item.quantity,
        }));
        const order = await OrderRepository.instance.create(userId, items, payment.id!, shipment.id!, "Pending", false);
        return this.parseOrderJSON(order);
    }

    async getOrderById(orderId: string): Promise<Order | null> {
        const orderjson = await OrderRepository.instance.getById(orderId);
        if (!orderjson) return null;
        return this.parseOrderJSON(orderjson);
    }

    async getOrdersByUser(userId: string): Promise<Order[]> {
        const orders = await OrderRepository.instance.getByUserId(userId);
        return Promise.all(orders.map(order => this.parseOrderJSON(order)));
    }

    async updateOrder(orderId: string, data: Partial<Order>): Promise<void> {
        await OrderRepository.instance.update(orderId, data);
    }

    async deleteOrder(orderId: string): Promise<void> {
        await OrderRepository.instance.delete(orderId);
    }

    async generateReceipt(order: Order): Promise<Receipt> {
        if (!order.verify()) {
            throw new Error("Order is not valid");
        }

        const user = await AccountController.instance.getAccount(order.userId);
        if (!user) throw new Error(`User not found: ${order.userId}`);

        const receipt = new Receipt(
            order,
            user,
            order.items.map(item => ({
                product: item.product,
                quantity: item.quantity,
                price: item.product.price * item.quantity
            })),
            order.getTotalPrice(),
            order.payment!,
            order.shipment!
        );
        const receiptText = this.generateReceiptText(receipt);
        const blob = new Blob([receiptText], {type: "text/plain"});
        const url = URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = `receipt-${order.id}.txt`
        a.click()
        URL.revokeObjectURL(url)
        return receipt;
    }


    async checkout(paymentDetails: Partial<JointPayment>, shipmentDetails: Partial<JointShipment>): Promise<Order> {
        if (!AccountController.loggedInUser) {
            throw new Error("User not logged in");
        }
        if (!paymentDetails.type || !shipmentDetails.type) {
            throw new Error("Payment and shipment type must be provided");
        }

        const user = await AccountController.instance.getAccount(AccountController.loggedInUser);
        const cart = await CartController.instance.getCart(user.id);
        if (cart.items.length === 0) {
            throw new Error("Cart is empty");
        }

        const catalogue = await CatalogueController.instance.getCatalogue();

        if (cart.items.some(item => catalogue.getItemQuantity(item.product) < item.quantity)) {
            throw new Error("One or more products are not available");
        }

        const order = new Order(user.id);

        cart.items.forEach(item => {
            order.addItem(item.product, item.quantity);
        });

        if (shipmentDetails.type === "delivery") {
            shipmentDetails = {
                ...shipmentDetails,
                address: shipmentDetails.address || user.address!
            };
        }

        const shipment = ShipmentController.instance.createShipmentObject(shipmentDetails);
        order.setShipment(shipment);

        paymentDetails.amount = cart.getSubtotalPrice() + shipment.fee;

        if (paymentDetails.type === "card") {
            paymentDetails = {
                ...paymentDetails,
                cardNumber: paymentDetails.cardNumber,
                expiryDate: paymentDetails.expiryDate || new Date().toISOString(),
                paymentGateway: paymentDetails.paymentGateway || "Online",
            };
        }

        const payment = PaymentController.instance.createPaymentObject(paymentDetails);
        order.setPayment(payment);

        const storedShipment = await ShipmentController.instance.storeShipment(order.shipment!);
        const storedPayment = await PaymentController.instance.storePayment(order.payment!);

        const createdOrder = await this.createOrder(
            order.userId,
            order.items,
            storedPayment,
            storedShipment
        );

        await Promise.all(
            order.items.map(item =>
                CatalogueController.instance.updateProductQuantity(
                    item.product,
                    catalogue.getItemQuantity(item.product) - item.quantity
                )
            )
        );

        await CartController.instance.emptyCart(user.cart!);
        if(createdOrder) {
            NotificationController.instance.update("Order placed successfully!")
        }
        return createdOrder;
    }

}

export { OrderController };