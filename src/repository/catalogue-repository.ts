import type { CatalogueItem } from "../models/catalogue";

class CatalogueRepository {
    private static _instance: CatalogueRepository;
    private baseUrl = 'http://localhost:3000/catalogue';

    private constructor() {}

    public static get instance(): CatalogueRepository {
        if (!CatalogueRepository._instance) {
            CatalogueRepository._instance = new CatalogueRepository();
        }
        return CatalogueRepository._instance;
    }

    async getAll(): Promise<CatalogueItem[]> {
        try {
            const response = await fetch(this.baseUrl)
            if (!response.ok) throw new Error('Failed to fetch products')
            return response.json()
        } catch (error) {
            throw new Error(`Failed to fetch products: ${error}`)
        }
    }

    async getById(id: string): Promise<CatalogueItem> {
        try {
            const response = await fetch(`${this.baseUrl}/${id}`)
            if (!response.ok) throw new Error(`Failed to fetch product with id ${id}`)
            return response.json()
        } catch (error) {
            throw new Error(`Failed to fetch product at id ${id}: ${error}`)
        }
    }

    async create(
        id: string,
        quantity: number,
    ): Promise<CatalogueItem> {
        try {
            const response = await fetch(this.baseUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ id, quantity })
            });
            if (!response.ok) throw new Error('Failed to create product');
            return response.json();
        } catch (error) {
            throw new Error(`Failed to create product: ${error}`);
        }
    }

    async update(
        id: string,
        quantity: number,
    ): Promise<CatalogueItem> {
        try {
            const response = await fetch(`${this.baseUrl}/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ quantity })
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

export { CatalogueRepository };