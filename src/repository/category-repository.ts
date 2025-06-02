import type { Category } from "../models/category"

class CategoryRepository {
    private static _instance: CategoryRepository;
    private baseUrl = 'http://localhost:3000/category';

    private constructor() {}

    public static get instance(): CategoryRepository {
        if (!CategoryRepository._instance) {
            CategoryRepository._instance = new CategoryRepository();
        }
        return CategoryRepository._instance;
    }

    async get(): Promise<Category[]> {
        try {
            const response = await fetch(this.baseUrl)
            if (!response.ok) throw new Error('Failed to fetch category')
            return response.json()
        } catch (error) {
            throw new Error(`Failed to fetch category: ${error}`)
        }
    }

    async getById(id: string): Promise<Category> {
        try {
            const response = await fetch(`${this.baseUrl}/${id}`)
            if (!response.ok) throw new Error(`Failed to fetch category with id ${id}`)
            return response.json()
        } catch (error) {
            throw new Error(`Failed to fetch category: ${error}`)
        }
    }
}

export { CategoryRepository };