import { Product } from "./product";

class Cart {
    userId: string;
    items: { product: Product; quantity: number }[];

    constructor(userId: string) {
        this.userId = userId;
        this.items = [];
    }

    addItem(product: Product, quantity: number) {
        const existingItem = this.items.find(item => item.product.id === product.id);
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            this.items.push({ product, quantity });
        }
    }

    removeItem(productId: string) {
        this.items = this.items.filter(item => item.product.id !== productId);
    }

    getItems() {
        return this.items;
    }

    updateItemQuantity(productId: string, quantity: number) {
        const item = this.items.find(item => item.product.id === productId);
        if (item) {
            item.quantity = quantity;
        }
    }

    getSubtotalPrice() {
        return this.items.reduce((total, item) => total + item.product.price * item.quantity, 0);
    }

}

export { Cart };