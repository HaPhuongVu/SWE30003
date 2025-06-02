import { Order } from "../models/order"

class OrderRepository {
    private static _instance: OrderRepository;
    private baseUrl = 'http://localhost:3000/order';

    private constructor() {}

    public static get instance(): OrderRepository {
        if (!OrderRepository._instance) {
            OrderRepository._instance = new OrderRepository();
        }
        return OrderRepository._instance;
    }

    async getById(orderId: string): Promise<Order | null> {
        try {
            const response = await fetch(`${this.baseUrl}/${orderId}`)
            if (!response.ok) throw new Error(`Failed to fetch order ${orderId}`)
            return response.json()
        } catch (error) {
            throw new Error(`Failed to get order data: ${error}`)
        }
    }

    async getByUserId(userId: string): Promise<Order[]> {
        try {
            const response = await fetch(`${this.baseUrl}?userId=${userId}`)
            if (!response.ok) throw new Error('Failed to fetch orders')
            return response.json()
        } catch (error) {
            throw new Error(`Failed to get order data: ${error}`)
        }
    }

    async create(
        userId: string,
        items: { productId: string, quantity: number }[],
        paymentId: string,
        shipmentId: string,
        status: string,
        cancellation: boolean
    ): Promise<Order> {
        try {
            const today = new Date().toLocaleDateString("en-GB")
            const response = await fetch(this.baseUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId,
                    orderDate: today,
                    items,
                    paymentId,
                    shipmentId,
                    status,
                    cancellation
                })
            });
            if (!response.ok) throw new Error('Failed to create new order');
            return response.json();
        } catch (error) {
            throw new Error(`Failed to create new order: ${error}`);
        }
    }

    async update(
        orderId: string,
        data: Partial<Order>
    ): Promise<Order> {
        try {
            const response = await fetch(`${this.baseUrl}/${orderId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            if (!response.ok) throw new Error(`Failed to update order ${orderId}`);
            return response.json();
        } catch (error) {
            throw new Error(`Failed to update order: ${error}`);
        }
    }

    async delete(orderId: string): Promise<void> {
        try {
            const response = await fetch(`${this.baseUrl}/${orderId}`, {
                method: 'DELETE'
            })
            if (!response.ok) throw new Error('Failed to delete order')
        } catch (error) {
            throw new Error(`Failed to delete order: ${error}`)
        }
    }
}

export { OrderRepository };