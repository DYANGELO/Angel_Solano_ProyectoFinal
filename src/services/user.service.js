import { User } from "../models/user.model.js";
import bcrypt from "bcrypt";
import { Cart } from "../models/cart.model.js";

export class UserService {
  // Registrar usuario con carrito asociado
  async register(userData) {
    const { email, password } = userData;

    // Verificar si el usuario ya existe
    const existingUser = await User.findOne({ email });
    if (existingUser) throw new Error("El usuario ya existe");

    // Crear carrito para el usuario
    const cart = await Cart.create({ products: [] });

    // Encriptar contraseña y crear usuario
    const hashedPassword = bcrypt.hashSync(password, 10);
    const user = await User.create({
      ...userData,
      password: hashedPassword,
      cart: cart._id,
    });

    return user;
  }

  // Login de usuario
  async login(email, password) {
    const user = await User.findOne({ email }).populate("cart");
    if (!user || !bcrypt.compareSync(password, user.password)) {
      throw new Error("Credenciales inválidas");
    }
    return user;
  }

  // Obtener usuario por ID
  async getUserById(id) {
    const user = await User.findById(id).populate("cart");
    if (!user) throw new Error("Usuario no encontrado");
    return user;
  }

  // Actualizar rol de usuario (solo admin)
  async updateUserRole(id, newRole) {
    const validRoles = ["user", "admin"];
    if (!validRoles.includes(newRole)) throw new Error("Rol inválido");

    const user = await User.findByIdAndUpdate(
      id,
      { role: newRole },
      { new: true }
    );
    if (!user) throw new Error("Usuario no encontrado");
    return user;
  }

  // Eliminar usuario (solo admin)
  async deleteUser(id) {
    const user = await User.findByIdAndDelete(id);
    if (!user) throw new Error("Usuario no encontrado");
    await Cart.findByIdAndDelete(user.cart); // Eliminar carrito asociado
    return user;
  }
}