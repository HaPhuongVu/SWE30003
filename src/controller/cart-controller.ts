// import { queryClient } from "../main"
import { Cart } from "../models/cart"
import { Product } from "../models/product";
import { CartRepository } from "../repository/cart-repository"
import { ProductRepository } from "../repository/product-repository"
import type { CartItem } from "../models/cart"


class CartController {
  private static _instance: CartController;

  private constructor() {}

  static get instance(): CartController {
    if (!CartController._instance) {
      CartController._instance = new CartController();
    }
    return CartController._instance;
  }

  async getCart(userId: string): Promise<Cart> {
    const cart = new Cart(userId);

    const cartItems = await CartRepository.instance.getByUserId(userId);

    await Promise.all(
      cartItems.map(async (item: CartItem) => {
        const product = await ProductRepository.instance.getById(item.productId);
        if (product) {
          cart.addItem(product, item.quantity);
        }
      })
    );

    return cart;
  }

  async addProductToCart(cart: Cart, product: Product, quantity: number = 1): Promise<Cart> {
    try {
      if (cart.containsProduct(product)) {
        const addedQuantity = cart.getItemQuantity(product) + quantity;
        await CartRepository.instance.update(cart.userId, product.id, addedQuantity);
      } else {
        await CartRepository.instance.addProduct(cart.userId, product.id, quantity);
      }
      cart.addItem(product, quantity);
      return cart;
    } catch (error) {
      throw new Error(`Failed to add product to cart: ${error}`);
    }
  }

  async removeProductInCart(cart: Cart, product: Product): Promise<Cart> {
    try {
      await CartRepository.instance.removeProduct(cart.userId, product.id);
      cart.removeItem(product);
      return cart;
    } catch (error) {
      throw new Error(`Failed to remove product from cart: ${error}`);
    }
  }

  async emptyCart(cart: Cart): Promise<Cart> {
    try {
      cart.items.map((item) => CartRepository.instance.removeProduct(cart.userId, item.product.id))
      return cart;
    } catch(error) {
      console.error("Error while emptying cart:", error);
      throw new Error('Failed to empty cart!');
    }
  }

  calculateTotal(cart: Cart): number {
    return Number(cart.getSubtotalPrice().toFixed(2));
  }
}

export { CartController };

