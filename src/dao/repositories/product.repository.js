import { Product } from "../models/product.model.js";

export class ProductRepository {
  // Crear producto
  async create(productData) {
    return await Product.create(productData);
  }

  // Buscar producto por ID
  async findById(id) {
    return await Product.findById(id);
  }

  // Buscar todos los productos (con paginación)
  async findAll(query = {}, options = {}) {
    const { limit = 10, page = 1, sort = {} } = options;
    const result = await Product.paginate(query, {
      limit: parseInt(limit),
      page: parseInt(page),
      sort,
      lean: true,
    });
    return result;
  }

  // Actualizar producto
  async update(id, productData) {
    return await Product.findByIdAndUpdate(id, productData, { new: true });
  }

  // Eliminar producto
  async delete(id) {
    return await Product.findByIdAndDelete(id);
  }

  // Verificar stock
  async checkStock(productId, quantity) {
    const product = await this.findById(productId);
    return product && product.stock >= quantity;
  }
}