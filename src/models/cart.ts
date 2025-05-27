import { Product } from './product';

class Cart {
    private items: Map<Product, number>;

    constructor(items?: Map<Product, number>) {
        if (items) {
            this.items = new Map(items);
        } else {
            this.items = new Map<Product, number>();
        }
    }

    getItems(): Map<Product, number> {
        return this.items;
    }

    addItem(product: Product, quantity: number): void {
        if (this.items.has(product)) {
            this.items.set(product, this.items.get(product)! + quantity);
        } else {
            this.items.set(product, quantity);
        }
    }

    removeItem(product: Product): void {
        this.items.delete(product);
    }

    updateItemQuantity(product: Product, quantity: number): void {
        if (this.items.has(product)) {
            this.items.set(product, quantity);
        }
    }

    calculateSubtotal(): number {
        let subtotal = 0;
        this.items.forEach((quantity, product) => {
            subtotal += product.price * quantity;
        });
        return subtotal;
    }
}

export { Cart };