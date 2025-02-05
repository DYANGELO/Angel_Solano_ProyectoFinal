import { Cart } from "../models/cart.model.js";
import { Product } from "../models/product.model.js";

export class CartService {
  // Crear carrito
  async createCart() {
    return await Cart.create({ products: [] });
  }

  // Obtener carrito con productos poblados
  async getCartById(id) {
    const cart = await Cart.findById(id).populate("products.product");
    if (!cart) throw new Error("Carrito no encontrado");
    return cart;
  }

  // Agregar producto al carrito
  async addProductToCart(cartId, productId, quantity = 1) {
    const product = await Product.findById(productId);
    if (!product) throw new Error("Producto no encontrado");

    const cart = await Cart.findById(cartId);
    if (!cart) throw new Error("Carrito no encontrado");

    const productIndex = cart.products.findIndex((p) =>
      p.product.equals(productId)
    );

    if (productIndex === -1) {
      cart.products.push({ product: productId, quantity });
    } else {
      cart.products[productIndex].quantity += quantity;
    }

    await cart.save();
    return cart;
  }

  // Eliminar producto del carrito
  async removeProductFromCart(cartId, productId) {
    const cart = await Cart.findById(cartId);
    if (!cart) throw new Error("Carrito no encontrado");

    cart.products = cart.products.filter(
      (p) => !p.product.equals(productId)
    );
    await cart.save();
    return cart;
  }

  // Vaciar carrito
  async clearCart(cartId) {
    const cart = await Cart.findByIdAndUpdate(
      cartId,
      { products: [] },
      { new: true }
    );
    if (!cart) throw new Error("Carrito no encontrado");
    return cart;
  }

  // Finalizar compra
  async purchaseCart(cartId, userEmail) {
    const cart = await this.getCartById(cartId);
    const ticketService = new TicketService();
    return await ticketService.generateTicket(cart, userEmail);
  }
}