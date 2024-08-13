"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAvailableStockQtyByProductCode = exports.checkProductCodeExists = exports.addSales = exports.addStock = exports.getProductList = exports.insertProduct = void 0;
const uuid_1 = require("uuid");
const db_1 = require("./db");
// Insert a product into the database
const insertProduct = async (product) => {
    const db = (0, db_1.getDatabase)();
    const collection = db.collection('products');
    product.productId = (0, uuid_1.v4)();
    try {
        const result = await collection.insertOne(product);
        return result;
    }
    catch (error) {
        console.error('Error inserting product:', error);
        throw error; // Rethrow the error after logging it
    }
};
exports.insertProduct = insertProduct;
// Get Product list from database
const getProductList = async () => {
    const db = (0, db_1.getDatabase)();
    const collection = db.collection('products');
    try {
        // Find all documents in the collection
        const cursor = collection.find();
        // Convert cursor to array
        const result = await cursor.toArray();
        return result;
    }
    catch (error) {
        console.error('Error getting product list:', error);
        throw error; // Rethrow the error after logging it
    }
};
exports.getProductList = getProductList;
// add Stock into the database
const addStock = async (stock) => {
    const db = (0, db_1.getDatabase)();
    const collection = db.collection('stocks');
    try {
        const result = await collection.insertOne(stock);
        return result;
    }
    catch (error) {
        console.error('Error adding stock: ', error);
        throw error; // Rethrow the error after logging it
    }
};
exports.addStock = addStock;
// add Sales into the database
const addSales = async (sales) => {
    const db = (0, db_1.getDatabase)();
    const collection = db.collection('sales');
    try {
        const result = await collection.insertOne(sales);
        return result;
    }
    catch (error) {
        console.error('Error adding sales:', error);
        throw error; // Rethrow the error after logging it
    }
};
exports.addSales = addSales;
const checkProductCodeExists = async (productCodeToCheck) => {
    const db = (0, db_1.getDatabase)();
    const collection = db.collection('products');
    const query = { productCode: productCodeToCheck };
    try {
        const product = await collection.findOne(query);
        if (product) {
            console.log(`Product with code ${productCodeToCheck} exists.`);
            return true; // Product code exists
        }
        else {
            console.log(`Product with code ${productCodeToCheck} does not exist.`);
            return false; // Product code does not exist
        }
    }
    catch (error) {
        console.error('Error checking product:', error);
        throw error; // Rethrow the error after logging it
    }
};
exports.checkProductCodeExists = checkProductCodeExists;
const getAvailableStockQtyByProductCode = async (productCode) => {
    const db = (0, db_1.getDatabase)();
    const collectionStock = db.collection('stocks');
    const collectionSales = db.collection('sales');
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
        let totalStockQty = 0;
        let totalSalesQty = 0;
        let totalAvailableStock = 0;
        const stockresult = await collectionStock.aggregate(aggregationPipeline).toArray();
        const salesresult = await collectionSales.aggregate(aggregationPipeline).toArray();
        if (stockresult.length > 0) {
            totalStockQty = stockresult[0].totalSum;
        }
        if (salesresult.length > 0) {
            totalSalesQty = salesresult[0].totalSum;
        }
        totalAvailableStock = totalStockQty - totalSalesQty;
        console.log(`Total Stock: ${totalStockQty} , Total Sales: ${totalSalesQty}, Available Stock: ${totalAvailableStock}`);
        return totalAvailableStock;
    }
    catch (error) {
        console.error('Error checking stock available or not:', error);
        throw error; // Rethrow the error after logging it
    }
};
exports.getAvailableStockQtyByProductCode = getAvailableStockQtyByProductCode;
