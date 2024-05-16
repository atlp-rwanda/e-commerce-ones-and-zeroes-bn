import { db } from '../database/models/index';

class ProductService {
  // Method to get a product by ID
  static async getProductById(id: string) {
    return await db.Product.findByPk(id);
  }

  // Method to delete a product
  static async deleteProduct(id: string) {
    const product = await this.getProductById(id);
    if (product) {
      await product.destroy();
    }
    return product;
  }
}

export default ProductService;
