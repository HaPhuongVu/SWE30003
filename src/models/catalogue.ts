import { Product } from './product';

type CatalogueItem = {
    id: string;
    availableQuantity: number;
}

class Catalogue {
    items: {product: Product, availableQuantity: number}[];

    constructor() {
        this.items = [];
    }

    addItem(product: Product, availableQuantity: number) {
        this.items.push({ product, availableQuantity });
    }

    removeItem(product: Product) {
        this.items = this.items.filter(item => item.product.id !== product.id);
    }

    getItems() {
        return this.items;
    }

    getItemQuantity(product: Product): number {
        const item = this.items.find(item => item.product.id === product.id);
        return item ? item.availableQuantity : 0;
    }

    updateItemQuantity(product: Product, quantity: number) {
        const item = this.items.find(item => item.product.id === product.id);
        if (item) {
            item.availableQuantity = quantity;
        }
    }
}

export { Catalogue };
export type { CatalogueItem };