import { Router, Request, Response } from 'express';
import { addSales, addStock, checkProductCodeExists, getAvailableStockQtyByProductCode, getProductList, insertProduct } from '../config/product_db_methods';
import Product from '../config/product';
import { Stock } from '../config/stock';
import { Sale } from '../config/sales';

const router = Router();

// POST route to insert a product
router.post('/insert', async (req: Request, res: Response) => {
  const product = req.body as Product;
  try {
    const isProductCodeAlreadyExist = await checkProductCodeExists(product.productCode);
    if (isProductCodeAlreadyExist) {
      res.status(400).json({ message: `Product code: ${product.productCode} already exist. Could not insert product details.` });
    }
    else {
      const result = await insertProduct(product);
      res.status(201).json({ message: 'Product inserted successfully', _id: result.insertedId });
    }
  } catch (error) {
    res.status(500).json({ error: `An error occurred while inserting the product ${error}` });
  }
});

//GET Route to get Product List
router.get('/getProductList', async (req: Request, res: Response) => {
  try {
    const result = await getProductList();
    res.status(200).json({ productList: result });
  } catch (error) {
    res.status(500).json({ error: `An error occurred while getting the product list ${error}` });
  }
});

// POST route to add Stock
router.post('/addStock', async (req: Request, res: Response) => {
  const stock = req.body as Stock
  try {
    const isProductCodeExist = await checkProductCodeExists(stock.productCode);
    if (isProductCodeExist) {
      const result = await addStock(stock)
      res.status(201).json({ message: 'Stock added successfully', _id: result.insertedId });
    }
    else {
      res.status(400).json({ message: `Product code: ${stock.productCode} does not exist. Could not add stock.` });
    }
  } catch (error) {
    res.status(500).json({ error: `An error occurred while adding stock. ${error}` });
  }
});

// POST route to add Stock
router.post('/addSales', async (req: Request, res: Response) => {
  const sale = req.body as Sale
  try {

    const isProductCodeExist = await checkProductCodeExists(sale.productCode);
    if (isProductCodeExist) {
      const availableStock: number = await getAvailableStockQtyByProductCode(sale.productCode);
      if (availableStock - sale.qty >= 0) {
        const result = await addSales(sale)
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
  } catch (error) {
    res.status(500).json({ error: `An error occurred while adding sales. ${error} ` });
  }
});

export default router;