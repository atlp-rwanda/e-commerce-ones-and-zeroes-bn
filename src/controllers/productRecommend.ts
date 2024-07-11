import { where } from 'sequelize';
import { db } from '../database/models';

const productRecommend = async (req: any, res: any) => {
  try {
    const { productId } = req.body;
    console.log(productId);
    const product = await db.Product.findByPk(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    const allProducts = await db.Product.findAll({
      where: {
        isAvailable: true,
      },
    });
    const availableProducts = allProducts.filter(
      (item: { productId: any }) => item.productId != productId,
    );
    const collectionID = product.collectionId;
    const relatedProducts = availableProducts.filter(
      (item: { collectionId: any }) => item.collectionId == collectionID,
    );
    const productName = product.name.split(' ')[0].toLowerCase();
    const similarNameProducts = availableProducts.filter(
      (item: { name: any }) => item.name.toLowerCase().includes(productName),
    );
    const combinedProducts = [
      ...new Set([...relatedProducts, ...similarNameProducts]),
    ];
    const recommendedProducts = combinedProducts.slice(0, 5);

    return res.status(200).json({
      message: 'Recommended products',
      products: recommendedProducts,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export default productRecommend;
