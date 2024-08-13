"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const product_db_methods_1 = require("../config/product_db_methods");
const router = (0, express_1.Router)();
// POST route to insert a product
router.post('/insert', async (req, res) => {
    const product = req.body;
    try {
        const isProductCodeAlreadyExist = await (0, product_db_methods_1.checkProductCodeExists)(product.productCode);
        if (isProductCodeAlreadyExist) {
            res.status(400).json({ message: `Product code: ${product.productCode} already exist. Could not insert product details.` });
        }
        else {
            const result = await (0, product_db_methods_1.insertProduct)(product);
            res.status(201).json({ message: 'Product inserted successfully', _id: result.insertedId });
        }
    }
    catch (error) {
        res.status(500).json({ error: `An error occurred while inserting the product ${error}` });
    }
});
//GET Route to get Product List
router.get('/getProductList', async (req, res) => {
    try {
        const result = await (0, product_db_methods_1.getProductList)();
        res.status(200).json({ productList: result });
    }
    catch (error) {
        res.status(500).json({ error: `An error occurred while getting the product list ${error}` });
    }
});
// POST route to add Stock
router.post('/addStock', async (req, res) => {
    const stock = req.body;
    try {
        const isProductCodeExist = await (0, product_db_methods_1.checkProductCodeExists)(stock.productCode);
        if (isProductCodeExist) {
            const result = await (0, product_db_methods_1.addStock)(stock);
            res.status(201).json({ message: 'Stock added successfully', _id: result.insertedId });
        }
        else {
            res.status(400).json({ message: `Product code: ${stock.productCode} does not exist. Could not add stock.` });
        }
    }
    catch (error) {
        res.status(500).json({ error: `An error occurred while adding stock. ${error}` });
    }
});
// POST route to add Stock
router.post('/addSales', async (req, res) => {
    const sale = req.body;
    try {
        const isProductCodeExist = await (0, product_db_methods_1.checkProductCodeExists)(sale.productCode);
        if (isProductCodeExist) {
            const availableStock = await (0, product_db_methods_1.getAvailableStockQtyByProductCode)(sale.productCode);
            if (availableStock - sale.qty >= 0) {
                const result = await (0, product_db_methods_1.addSales)(sale);
                res.status(201).json({ message: 'Sales added successfully', _id: result.insertedId });
            }
            else {
                res.status(400).json({ message: `Available stock for Product Code ${sale.productCode} is ${availableStock} only, so could not add sales.` });
            }
        }
        else {
            res.status(400).json({ message: `Product code: ${sale.productCode} does not exist. Could not add sale.` });
        }
        //res.status(201).json({ message: 'Product inserted successfully' });
    }
    catch (error) {
        res.status(500).json({ error: `An error occurred while adding sales. ${error} ` });
    }
});
exports.default = router;
