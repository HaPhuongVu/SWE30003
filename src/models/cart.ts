import { Product } from "./product";

type CartItem = {
    id: string;
    productId: string;
    userId: string;
    quantity: number;
}

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

    removeItem(product: Product) {
        this.items = this.items.filter(item => item.product.id !== product.id);
    }

    getItemQuantity(product: Product): number {
        const item = this.items.find(item => item.product.id === product.id);
        return item ? item.quantity : 0;
    }

    setItemQuantity(product: Product, quantity: number) {
        const item = this.items.find(item => item.product.id === product.id);
        if (item) {
            item.quantity = quantity;
        }
    }

    containsProduct(product: Product): boolean {
        return this.items.some(item => item.product.id === product.id);
    }

    getSubtotalPrice() {
        return this.items.reduce((total, item) => total + item.product.price * item.quantity, 0);
    }

}

export { Cart };
export type { CartItem };