import { queryClient } from "../main"
import type { Cart } from "../models/cart";
import { cartAPI } from "../repository/cart-repository"
import { orderAPI } from "../repository/order-repository";
import { USERID } from "./account-controller"

export const addProductToCart = async (productId: string,  quantity: number = 1) => {
  if(USERID){
    try{
      const cartItems = await cartAPI.getCart();
      const existItem = cartItems.find((item: {productId: string}) => item.productId === productId)
      let addedQuantity = quantity
      if (existItem){
        addedQuantity = existItem.quantity + quantity
        await cartAPI.updateCart(existItem.id, productId, addedQuantity)
      } else {
        await cartAPI.addProductToCart(productId, quantity)
      }
      alert('Product successfully added')
    } catch(error){
      alert(`Error, try again! ${error}`)
    }
  } else {
    alert('You need to login to add product')
  }
}

export const removeProductInCart = async(cartId: string) => {
    try{
        await cartAPI.removeProductInCart(cartId)
        queryClient.invalidateQueries({queryKey: ['cart']})
    } catch(error){
        alert(`Error, try again! ${error}`)
    }
}

export const emptyCart = (cartItems: Cart[]) => {
  try{
    cartItems.map((item) => (
      cartAPI.removeProductInCart(item?.id)
    ))
  }catch(error){
    alert ('Order failed!')
  }
}

export const totalCart = (cartItems: Cart[], productData: any) => {
  let total = 0;
  cartItems?.forEach((item, index) => {
    const product = productData[index]?.data;
    total += (product?.price ?? 0) * item.quantity;
  });
  return Number(total.toFixed(2));
}

export const handleCheckout = async(cartItems: Cart[], productData: any) => {
  try{
    const orderItems = cartItems?.map(item => ({
      productId: item.productId,
      quantity: item.quantity
    }))
    await orderAPI.create(orderItems!, totalCart(cartItems, productData), "", "", "Pending", false)
    emptyCart(cartItems!)
    alert('Order success')
    window.location.reload()
  } catch(error){
    alert('Order failed. Please try again')
  }
}
