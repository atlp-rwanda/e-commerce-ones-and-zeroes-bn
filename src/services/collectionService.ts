import { db } from '../database/models/index';

class CollectionService {
  // Method to get a collection by ID
  static async getCollectionById(id: string) {
    try {
      const collection = await db.Collection.findByPk(id);
      return collection;
    } catch (error) {
      console.error(
        `Error occurred while fetching collection with id ${id}: `,
        error,
      );
      throw error;
    }
  }
}

export default CollectionService;
