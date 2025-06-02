import { Product } from './product';

type CatalogueItem = {
    id: string;
    quantity: number;
}

class Catalogue {
    items: {product: Product, quantity: number}[];

    constructor() {
        this.items = [];
    }

    addItem(product: Product, quantity: number) {
        this.items.push({ product, quantity });
    }

    removeItem(product: Product) {
        this.items = this.items.filter(item => item.product.id !== product.id);
    }

    getItems() {
        return this.items;
    }

    updateItemQuantity(product: Product, quantity: number) {
        const item = this.items.find(item => item.product.id === product.id);
        if (item) {
            item.quantity = quantity;
        }
    }
}

export { Catalogue };
export type { CatalogueItem };