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
    }

    async getAll(): Promise<Product[]> {
        try {
            const response = await fetch(this.baseUrl)
            if (!response.ok) throw new Error('Failed to fetch products')
            return response.json()
        } catch (error) {
            throw new Error(`Failed to fetch products: ${error}`)
        }
    }

    async getById(id: string): Promise<Product | null> {
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

    async create(
        name: string,
        image: string,
        shortDescription: string,
        longDescription: string,
        price: number,
        category: string
    ): Promise<Product> {
        try {
            const response = await fetch(this.baseUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ name, image, shortDescription, longDescription, price, category })
            });
            if (!response.ok) throw new Error('Failed to create product');
            return response.json();
        } catch (error) {
            throw new Error(`Failed to create product: ${error}`);
        }
    }

    async update(
        id: string,
        data: Partial<Product>
    ): Promise<Product> {
        try {
            const response = await fetch(`${this.baseUrl}/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });
            if (!response.ok) throw new Error(`Failed to update product with id ${id}`);
            return response.json();
        } catch (error) {
            throw new Error(`Failed to update product with id ${id}: ${error}`);
        }
    }

    async delete(id: string): Promise<void> {
        try {
            const response = await fetch(`${this.baseUrl}/${id}`, {
                method: 'DELETE'
            });
            if (!response.ok) throw new Error(`Failed to delete product with id ${id}`);
        } catch (error) {
            throw new Error(`Failed to delete product with id ${id}: ${error}`);
        }
    }
}

export { ProductRepository };