import type { Category } from "./category";

class Product {
    id: string;
    name: string;
    image: string;
    shortDescription: string;
    longDescription: string;
    price: number;
    category?: Category;

    constructor(id: string, name: string, image:string, shortDescription: string, longDescription: string, price: number, category?: Category) {
        this.id = id;
        this.name = name;
        this.image = image;
        this.shortDescription = shortDescription;
        this.longDescription = longDescription;
        this.price = price;
        this.category = category;
    }

    updateDetails(name?: string, image?: string, shortDescription?: string, longDescription?: string, price?: number, category?: Category) {
        if (name) this.name = name;
        if (image) this.image = image;
        if (shortDescription) this.shortDescription = shortDescription;
        if (longDescription) this.longDescription = longDescription;
        if (price !== undefined) this.price = price;
        if (category) this.category = category;
    }
}

export { Product };