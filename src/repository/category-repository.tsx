import type { Category } from "../models/category"

const getCategory = async():Promise<Category[]> => {
    try{
        const response = await fetch('http://localhost:3000/category')
        if (!response.ok) throw new Error('Failed to fetch category')
        return response.json()
    }catch (error){
        throw new Error(`Failed to fetch category ${error}`)
    }
}

const getCategoryById = async(id:string) => {
    try{
        const response = await fetch(`http://localhost:3000/category/${id}`)
        if (!response.ok) throw new Error(`Failed to fetch category with id ${id}`)
        return response.json()
    }catch (error){
        throw new Error(`Failed to fetch category ${error}`)
    }
}

export const categoryAPI = {
    get: getCategory,
    getById: getCategoryById
}