import { Ticket } from "../models/ticket.model.js";
import { Product } from "../models/product.model.js";

export class TicketService {
  // Generar ticket de compra
  async generateTicket(cart, purchaserEmail) {
    const unprocessedProducts = [];
    let totalAmount = 0;

    // Procesar cada producto del carrito
    for (const item of cart.products) {
      const product = await Product.findById(item.product._id);
      if (!product) continue;

      if (product.stock >= item.quantity) {
        product.stock -= item.quantity;
        await product.save();
        totalAmount += product.price * item.quantity;
      } else {
        unprocessedProducts.push(item.product._id);
      }
    }

    // Crear ticket
    const ticket = await Ticket.create({
      code: Math.random().toString(36).substring(2, 10).toUpperCase(),
      purchase_datetime: new Date(),
      amount: totalAmount,
      purchaser: purchaserEmail,
    });

    // Actualizar carrito con productos no procesados
    const cartService = new CartService();
    await cartService.clearCart(cart._id);
    for (const productId of unprocessedProducts) {
      await cartService.addProductToCart(cart._id, productId);
    }

    return {
      ticket,
      unprocessedProducts: unprocessedProducts.length > 0 ? unprocessedProducts : null,
    };
  }
}