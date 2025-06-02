import { Product } from "../models/product";

class ProductRepository {
    private static _instance: ProductRepository;
    private baseUrl = 'http://localhost:3000/product';

    private constructor() {}

    public static get instance(): ProductRepository {
        if (!ProductRepository._instance) {
            ProductRepository._instance = new ProductRepository();
        }
        return ProductRepository._instance;
    }    async get(): Promise<Product[]> {
        try {
            const response = await fetch(this.baseUrl)
            if (!response.ok) throw new Error('Failed to fetch products')
            return response.json()
        } catch (error) {
            throw new Error(`Failed to fetch products: ${error}`)
        }
    }

    async getById(id: string): Promise<Product> {
        try {
            const response = await fetch(`${this.baseUrl}/${id}`)
            if (!response.ok) throw new Error(`Failed to fetch product with id ${id}`)
            return response.json()
        } catch (error) {
            throw new Error(`Failed to fetch product at id ${id}: ${error}`)
        }
    }

    async getByCategory(categoryId: string): Promise<Product[]> {
        try {
            const response = await fetch(`${this.baseUrl}?category=${categoryId}`)
            if (!response.ok) throw new Error(`Failed to fetch product with category id ${categoryId}`)
            return response.json()
        } catch (error) {
            throw new Error(`Failed to fetch product with category ${categoryId}: ${error}`)
        }
    }
}

export { ProductRepository };