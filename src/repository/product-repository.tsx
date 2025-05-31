import type { Product } from "../models/product";

const getProduct = async():Promise<Product[]> => {
    try{
        const response = await fetch('http://localhost:3000/product')
        if(!response.ok) throw new Error('Failed to fetch product data')
        return response.json()
    } catch(error){
        throw new Error(`Failed to fetch product ${error}`)
    }
}

const getProductById = async(id: string) => {
    try{
        const response = await fetch(`http://localhost:3000/product/${id}`)
        if(!response.ok) throw new Error (`Failed to fetch product with id ${id}`)
        return response.json()
    } catch(error){
        throw new Error (`Faild to fetch product at id ${id}: ${error}`)
    }
}

const getProductByCategory = async(categoryId: string) => {
    try{
        const response = await fetch(`http://localhost:3000/product?category=${categoryId}`)
        if(!response.ok) throw new Error (`Failed to fetch product with category id ${categoryId}`)
        return response.json()
    } catch(error) {
        throw new Error (`Failed to fetch product with category ${categoryId}: ${error}`)
    }
}

export const productAPI = {
    get: getProduct,
    getById: getProductById,
    getByCategory: getProductByCategory
}