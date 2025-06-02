class Category {
    id: string;
    name: string;
    image: string;
    description: string;

    constructor(id: string, name: string, image:string, description: string) {
        this.id = id;
        this.name = name;
        this.image = image
        this.description = description;
    }
}

export { Category };