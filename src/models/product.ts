class Product {
    id: string;
    name: string;
    description: string;
    price: number;

    constructor(id: string, name: string, description: string, price: number) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.price = price;
    }

    modifyDetails(name?: string, description?: string, price?: number) {
        if (name) this.name = name;
        if (description) this.description = description;
        if (price !== undefined) this.price = price;
    }
}

export { Product };