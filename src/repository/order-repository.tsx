import { USERID } from "../controller/account-controller"
import type { Order } from "../models/order"

const getOrder = async():Promise<Order[]> => {
    try{
        const response = await fetch(`http://localhost:3000/order?userId=${USERID}`)
        if(!response.ok) throw new Error(`Failed to get order in user ${USERID}`)
        return response.json()
    }catch(error) {
        throw new Error ('Failed to get order data')
    }
}

const getOrderById = async(orderId: string):Promise<Order> => {
    try{
        const response = await fetch(`http://localhost:3000/order/${orderId}`)
        if(!response.ok) throw new Error(`Failed to get order with id ${orderId}`)
        return response.json()
    }catch(error) {
        throw new Error ('Failed to get order data')
    }
}

const createOrder = async(
    items: { productId: string, quantity: number }[],
    totalBill: number,
    payment: string,
    shipment: string,
    status: string,
    cancellation: boolean
): Promise<Order> => {
    try {
        const today = new Date().toLocaleDateString("en-GB")
        const response = await fetch(`http://localhost:3000/order`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                orderDate: today,
                items,
                totalBill,
                payment,
                shipment,
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

const deleteOrder = async(orderId: string) => {
    try{
        const response = await fetch(`http://localhost:3000/order/${orderId}`, {
            method: 'DELETE'
        })
        if (!response.ok) throw new Error ('Faild to delete order')
        return response.json()
    } catch(error) {
        throw new Error (`Failed to delete order: ${error}`)
    }
}
export const orderAPI = {
    get: getOrder,
    getById: getOrderById,
    create: createOrder,
    delete: deleteOrder
}