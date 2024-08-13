import express from "express"
import * as dotevnv from "dotenv"
import cors from "cors"
import helmet from "helmet"
import { connectToDatabase } from './config/db';
import productsRouter from './routes/product.routes';

dotevnv.config()

if (!process.env.PORT) {
    console.log(`No port value specified...`)
}

const PORT = parseInt(process.env.PORT as string, 10)

const app = express()

app.use(express.json())
app.use(express.urlencoded({extended : true}))
app.use(cors())
app.use(helmet())

// Use the products routes
app.use('/products', productsRouter);

app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`)
    connectToDatabase();
})