import type { Cart } from "../models/cart"

const getUserCart = async() => {
    try{
        const response = await fetch('http://localhost:3000/cart')
        if(!response.ok) throw new Error(`Failed to fetch cart`)
        return response.json()
    }catch(error){
        throw new Error(`Failed to get cart ${error}`)
    }
}

const updateCart = async(productId: string):Promise<Cart> => {
    try{
        const response = await fetch('http://localhost:3000/cart', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({productId})
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
export const cartAPI = {
    getCart: getUserCart,
    updateCart: updateCart,
    removeProductInCart: removeProductInCart
}