
class Cart {
    id: string;
    productId: string;
    userId: string;
    quantity: number;

    constructor(id: string, userId: string, productId: string){
        this.id = id
        this.productId = userId
        this.userId = productId
        this.quantity = 1
    }

}

export { Cart };