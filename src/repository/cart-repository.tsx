import { USERID } from "../controller/account-controller"
import type { Cart } from "../models/cart"

const getUserCart = async() => {
    try{
        const response = await fetch(`http://localhost:3000/cart?userId=${USERID}`)
        if(!response.ok) throw new Error(`Failed to fetch cart`)
        return response.json()
    }catch(error){
        throw new Error(`Failed to get cart ${error}`)
    }
}


const addProductToCart = async(productId: string, quantity: number):Promise<Cart> => {
    try{
        const response = await fetch('http://localhost:3000/cart', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({productId, USERID, quantity})
        })
        if (!response.ok) throw new Error(`Failed to update cart`)
        return response.json()
    } catch(error) {
        throw new Error (`Failed to update cart ${error}`)
    }
}

const removeProductInCart = async(cartId: string) => {
    try{
        const response = await fetch(`http://localhost:3000/cart/${cartId}`, {
            method: 'DELETE'
        })
        if(!response.ok) throw new Error ('Failed to delete product')
        return response.json()
    } catch(error) {
        throw new Error (`Failed to delete product ${error}`)
    }
}

const updateCart = async(cartId: string, productId: string, quantity: number) => {
    try{
        const response = await fetch(`http://localhost:3000/cart/${cartId}`, {
            method: 'PUT',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({productId, USERID, quantity})
        })
        if (!response.ok) throw new Error(`Failed to update cart`)
        return response.json()
    } catch(error) {
        throw new Error (`Failed to update cart ${error}`)
    }
}



export const cartAPI = {
    getCart: getUserCart,
    addProductToCart: addProductToCart,
    updateCart: updateCart,
    removeProductInCart: removeProductInCart,
}