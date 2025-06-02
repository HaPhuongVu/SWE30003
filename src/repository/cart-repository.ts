import type { CartItem } from "../models/cart"

class CartRepository {
    private static _instance: CartRepository;
    private baseUrl = 'http://localhost:3000/cart';

    private constructor() {}

    public static get instance(): CartRepository {
        if (!CartRepository._instance) {
            CartRepository._instance = new CartRepository();
        }
        return CartRepository._instance;
    }

    async getByUserId(userId: string): Promise<CartItem[]> {
        try {
            const response = await fetch(`${this.baseUrl}?userId=${userId}`)
            if (!response.ok) throw new Error('Failed to fetch cart')
            return response.json()
        } catch (error) {
            throw new Error(`Failed to get cart: ${error}`)
        }
    }

    async addProduct(userId: string, productId: string, quantity: number): Promise<CartItem> {
        try {
            const response = await fetch(this.baseUrl, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({productId, userId, quantity})
            })
            if (!response.ok) throw new Error('Failed to add product to cart')
            return response.json()
        } catch (error) {
            throw new Error(`Failed to update cart: ${error}`)
        }
    }

    async removeProduct(userId: string, productId: string): Promise<void> {
        try {
            const entry = await fetch(`${this.baseUrl}?userId=${userId}&productId=${productId}`)
            const cartId = (await entry.json())[0].id;
            const response = await fetch(`${this.baseUrl}/${cartId}`, {
                method: 'DELETE'
            })
            if (!response.ok) throw new Error('Failed to delete product')
        } catch (error) {
            throw new Error(`Failed to delete product: ${error}`)
        }
    }

    async update(userId: string, productId: string, quantity: number): Promise<CartItem> {
        try {
            const entry = await fetch(`${this.baseUrl}?userId=${userId}&productId=${productId}`)
            const cartId = (await entry.json())[0].id;
            const response = await fetch(`${this.baseUrl}/${cartId}`, {
                method: 'PUT',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({productId, userId, quantity})
            })
            if (!response.ok) throw new Error('Failed to update cart')
            return response.json()
        } catch (error) {
            throw new Error(`Failed to update cart: ${error}`)
        }
    }
}

export { CartRepository };