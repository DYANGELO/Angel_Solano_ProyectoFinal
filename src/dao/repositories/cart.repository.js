import { Cart } from "../models/cart.model.js";

export class CartRepository {
  // Crear carrito
  async create() {
    return await Cart.create({ products: [] });
  }

  // Buscar carrito por ID
  async findById(id) {
    return await Cart.findById(id).populate("products.product");
  }

  // Actualizar carrito
  async update(id, cartData) {
    return await Cart.findByIdAndUpdate(id, cartData, { new: true });
  }

  // Eliminar carrito
  async delete(id) {
    return await Cart.findByIdAndDelete(id);
  }

  // Agregar producto al carrito
  async addProduct(cartId, productId, quantity = 1) {
    const cart = await this.findById(cartId);
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
  async removeProduct(cartId, productId) {
    const cart = await this.findById(cartId);
    cart.products = cart.products.filter(
      (p) => !p.product.equals(productId)
    );
    await cart.save();
    return cart;
  }

  // Vaciar carrito
  async clear(cartId) {
    return await this.update(cartId, { products: [] });
  }
}