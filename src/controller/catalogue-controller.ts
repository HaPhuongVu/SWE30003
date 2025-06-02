import { Category } from "../models/category";
import { Product } from "../models/product";
import { CatalogueRepository } from "../repository/catalogue-repository";
import { ProductController } from "./product-controller";

class CatalogueController {
    private static _instance: CatalogueController;

    private constructor() {}

    static get instance(): CatalogueController {
        if (!CatalogueController._instance) {
            CatalogueController._instance = new CatalogueController();
        }
        return CatalogueController._instance;
    }

    async getAllProducts(): Promise<Product[]> {
        const productItems = await CatalogueRepository.instance.getAll();
        const products = await Promise.all(productItems.map(item => ProductController.instance.get(item.id)));
        return products.filter((product: Product | null): product is Product => product !== null);
    }

    async createProduct(
        name: string,
        image: string,
        shortDescription: string,
        longDescription: string,
        price: number,
        category: Category,
        quantity: number = 1
    ): Promise<Product> {
        const product = await ProductController.instance.create(name, image, shortDescription, longDescription, price, category);
        await CatalogueRepository.instance.create(product.id, quantity);
        return product;
    }

    async updateProductQuantity(product: Product, quantity: number): Promise<void> {
        await CatalogueRepository.instance.update(product.id, quantity);
    }

    async deleteProduct(product: Product): Promise<void> {
        await CatalogueRepository.instance.delete(product.id);
        await ProductController.instance.delete(product);
    }
}

export { CatalogueController };