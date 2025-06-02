import { Product } from './product';

class Catalogue {
    items: {product: Product, quantity: number}[];

    constructor() {
        this.items = [];
    }

    addItem(product: Product, quantity: number) {
        this.items.push({ product, quantity });
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
}

export { Catalogue };