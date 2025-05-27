import { Product } from './product';

class Catalogue {
    private items: Map<Product, number>;

    constructor() {
        this.items = new Map<Product, number>();
    }

    addItem(item: Product, quantity: number) {
        this.items.set(item, quantity);
    }

    removeItem(item: Product) {
        this.items.delete(item);
    }

    updateItemQuantity(item: Product, quantity: number) {
        if (this.items.has(item)) {
            this.items.set(item, quantity);
        }
    }

    getItems(): Map<Product, number> {
        return this.items;
    }
}

export { Catalogue };