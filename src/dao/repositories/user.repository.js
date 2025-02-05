import { User } from "../models/user.model.js";
import { Cart } from "../models/cart.model.js";

export class UserRepository {
  async create(userData) {
    const cart = await Cart.create({ products: [] }); 
    const user = await User.create({ ...userData, cart: cart._id }); 
    return user;
  }

  async findByEmail(email) {
    return await User.findOne({ email }).populate("cart");
  }

  async findById(id) {
    return await User.findById(id).populate("cart");
  }

  async update(id, userData) {
    return await User.findByIdAndUpdate(id, userData, { new: true });
  }

  async delete(id) {
    const user = await User.findByIdAndDelete(id);
    if (user) {
      await Cart.findByIdAndDelete(user.cart); 
    }
    return user;
  }
  async updateRole(id, newRole) {
    return await User.findByIdAndUpdate(id, { role: newRole }, { new: true });
  }
}
