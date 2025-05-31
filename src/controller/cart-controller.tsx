import { queryClient } from "../main"
import { cartAPI } from "../repository/cart-repository"

export const addProductToCart = async (productId: string) => {
    try{
      await cartAPI.updateCart(productId)
      alert('Product successfully added')
    } catch(error){
      alert(`Error, try again! ${error}`)
    }
}

export const removeProductInCart = async(cartId: string) => {
    try{
        await cartAPI.removeProductInCart(cartId)
        alert('Product removed successfully')
        queryClient.invalidateQueries({queryKey: ['cart']})
    } catch(error){
        alert(`Error, try again! ${error}`)
    }
}