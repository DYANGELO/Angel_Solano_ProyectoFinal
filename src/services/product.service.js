import { Product } from "../models/product.model.js";

export class ProductService {
  // Crear producto (admin)
  async createProduct(productData) {
    const existingProduct = await Product.findOne({ code: productData.code });
    if (existingProduct) throw new Error("El código del producto ya existe");

    const product = await Product.create(productData);
    return product;
  }

  // Obtener todos los productos
  async getProducts(limit = 10, page = 1, query = {}, sort = {}) {
    const options = {
      limit: parseInt(limit),
      page: parseInt(page),
      sort: sort === "desc" ? { price: -1 } : { price: 1 },
      lean: true,
    };

    const result = await Product.paginate(query, options);
    return {
      products: result.docs,
      totalPages: result.totalPages,
      prevPage: result.prevPage,
      nextPage: result.nextPage,
      page: result.page,
      hasPrevPage: result.hasPrevPage,
      hasNextPage: result.hasNextPage,
    };
  }

  // Obtener producto por ID
  async getProductById(id) {
    const product = await Product.findById(id);
    if (!product) throw new Error("Producto no encontrado");
    return product;
  }

  // Actualizar producto (admin)
  async updateProduct(id, productData) {
    const product = await Product.findByIdAndUpdate(id, productData, {
      new: true,
    });
    if (!product) throw new Error("Producto no encontrado");
    return product;
  }

  // Eliminar producto (admin)
  async deleteProduct(id) {
    const product = await Product.findByIdAndDelete(id);
    if (!product) throw new Error("Producto no encontrado");
    return product;
  }

  // Verificar stock
  async checkStock(productId, quantity) {
    const product = await Product.findById(productId);
    if (!product) throw new Error("Producto no encontrado");
    return product.stock >= quantity;
  }
}