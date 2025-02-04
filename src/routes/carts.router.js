import { TicketManager } from "../dao/managers/ticket.manager.js";

const ticketManager = new TicketManager();

router.post("/:cid/purchase", async (req, res) => {
  const cartId = req.params.cid;
  const cart = await cartManager.getCartById(cartId);

  const productsNotPurchased = [];
  let totalAmount = 0;

  for (const item of cart.products) {
    const product = await productManager.getProductById(item.product);
    if (product.stock >= item.quantity) {
      product.stock -= item.quantity;
      await product.save();
      totalAmount += product.price * item.quantity;
    } else {
      productsNotPurchased.push(item.product);
    }
  }

  const ticket = await ticketManager.createTicket({
    code: Math.random().toString(36).substring(7),
    amount: totalAmount,
    purchaser: req.user.email,
  });

  await cartManager.updateCart(cartId, { products: productsNotPurchased });

  res.json({ ticket, productsNotPurchased });
});