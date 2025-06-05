import { Category } from "../models/category";
import { Product } from "../models/product";
import { ProductRepository } from "../repository/product-repository";

class ProductController {
    private static _instance: ProductController;

    private constructor() {}

    static get instance(): ProductController {
        if (!ProductController._instance) {
            ProductController._instance = new ProductController();
        }
        return ProductController._instance;
    }

    async getProduct(id: string): Promise<Product | null> {
        return ProductRepository.instance.getById(id);
    }

    async getProductByCategory(categoryId: string): Promise<Product[]> {
        return ProductRepository.instance.getByCategory(categoryId);
    }

    async createProduct(
        name: string,
        image: string,
        shortDescription: string,
        longDescription: string,
        price: number,
        category: Category
    ): Promise<Product> {
        const product = await ProductRepository.instance.create(name, image, shortDescription, longDescription, price, category.id);
        return product;
    }

    async updateProduct(id: string, data: Partial<Product>): Promise<void> {
        await ProductRepository.instance.update(id, data);
    }

    async deleteProduct(product: Product): Promise<void> {
        await ProductRepository.instance.delete(product.id);
    }
}

export { ProductController };