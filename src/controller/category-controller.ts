import { Category } from "../models/category";
import { CategoryRepository } from "../repository/category-repository";

class CategoryController {
    private static _instance: CategoryController;

    private constructor() {}

    static get instance(): CategoryController {
        if (!CategoryController._instance) {
            CategoryController._instance = new CategoryController();
        }
        return CategoryController._instance;
    }

    async getAllCategories(): Promise<Category[]> {
        return CategoryRepository.instance.getAll();
    }

    async getCategoryById(id: string): Promise<Category | null> {
        return CategoryRepository.instance.getById(id);
    }
}

export { CategoryController };
