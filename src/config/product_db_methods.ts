import { Collection, Db, InsertOneResult } from 'mongodb';
import { v4 as generateId } from 'uuid';
import { getDatabase } from './db'
import Product from './product';
import { Stock } from './stock';
import { Sale } from './sales';

// Insert a product into the database
export const insertProduct = async (product: Product): Promise<InsertOneResult> => {
  const db = getDatabase() as Db;
  const collection: Collection = db.collection('products');
  product.productId = generateId();

  try {
    const result: InsertOneResult = await collection.insertOne(product);
    return result;
  } catch (error) {
    console.error('Error inserting product:', error);
    throw error; // Rethrow the error after logging it
  }
}

// Get Product list from database
export const getProductList = async (): Promise<unknown> => {
  const db = getDatabase() as Db; 
  const collection: Collection = db.collection('products');

  try {
    // Find all documents in the collection
    const cursor = collection.find();
    // Convert cursor to array
    const result = await cursor.toArray();
    return result;
  } catch (error) {
    console.error('Error getting product list:', error);
    throw error; // Rethrow the error after logging it
  }
}


// add Stock into the database
export const addStock = async (stock: Stock): Promise<InsertOneResult> => {
  const db = getDatabase() as Db; 
  const collection: Collection = db.collection('stocks');

  try {
    const result: InsertOneResult = await collection.insertOne(stock);
    return result;
  } catch (error) {
    console.error('Error adding stock: ', error);
    throw error; // Rethrow the error after logging it
  }
}

// add Sales into the database
export const addSales = async (sales: Sale): Promise<InsertOneResult> => {
  const db = getDatabase() as Db; 
  const collection: Collection = db.collection('sales');
  try {
    const result: InsertOneResult = await collection.insertOne(sales);
    return result;
  } catch (error) {
    console.error('Error adding sales:', error);
    throw error; // Rethrow the error after logging it
  }
}


export const checkProductCodeExists = async (productCodeToCheck: string): Promise<boolean> => {
  const db = getDatabase() as Db; 
  const collection: Collection = db.collection('products');
  const query = { productCode: productCodeToCheck };

  try {
    const product = await collection.findOne(query);
    if (product) {
      console.log(`Product with code ${productCodeToCheck} exists.`);
      return true; // Product code exists
    } else {
      console.log(`Product with code ${productCodeToCheck} does not exist.`);
      return false; // Product code does not exist
    }
  } catch (error) {
    console.error('Error checking product:', error);
    throw error; // Rethrow the error after logging it
  }
}

export const getAvailableStockQtyByProductCode = async (productCode: string): Promise<number> => {
  const db = getDatabase() as Db;
  const collectionStock: Collection = db.collection('stocks');
  const collectionSales: Collection = db.collection('sales');
  const query = { productCode: productCode };

  try {

    // Aggregation pipeline
    const aggregationPipeline = [
      {
        $match: query // Filter for the specific product
      },
      {
        $group: {
          _id: null, // Group all matching documents together
          totalSum: { $sum: '$qty' } // Sum of the qty field
        }
      }
    ];

    let totalStockQty: number = 0;
    let totalSalesQty: number = 0;
    let totalAvailableStock: number = 0;

    const stockresult = await collectionStock.aggregate(aggregationPipeline).toArray();
    const salesresult = await collectionSales.aggregate(aggregationPipeline).toArray();

    if (stockresult.length > 0) {
      totalStockQty = stockresult[0].totalSum;
    }

    if (salesresult.length > 0) {
      totalSalesQty = salesresult[0].totalSum;
    }

    totalAvailableStock = totalStockQty - totalSalesQty;
    console.log(`Total Stock: ${totalStockQty} , Total Sales: ${totalSalesQty}, Available Stock: ${totalAvailableStock}`)

    return totalAvailableStock;
  } catch (error) {
    console.error('Error checking stock available or not:', error);
    throw error; // Rethrow the error after logging it
  }
}


