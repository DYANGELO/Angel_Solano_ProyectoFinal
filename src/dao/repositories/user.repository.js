import { UserManager } from "../managers/user.manager.js";
import { UserDTO } from "../dtos/user.dto.js";

const userManager = new UserManager();

export class UserRepository {
  async createUser(userData) {
    return await userManager.createUser(userData);
  }

  async findUserByEmail(email) {
    const user = await userManager.findUserByEmail(email);
    return user ? new UserDTO(user) : null;
  }

  async findUserById(id) {
    const user = await userManager.findUserById(id);
    return user ? new UserDTO(user) : null;
  }
}