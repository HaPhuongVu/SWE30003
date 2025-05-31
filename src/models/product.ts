class Product {
    id: string;
    name: string;
    image: string;
    shortDescription: string;
    longDescription: string;
    price: number;

    constructor(id: string, name: string, image:string, shortDescription: string, longDescription: string, price: number) {
        this.id = id;
        this.name = name;
        this.image = image
        this.shortDescription = shortDescription;
        this.longDescription = longDescription;
        this.price = price;
    }
}

export { Product };