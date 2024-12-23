import express from 'express'
import { isAdmin, requireSignIn } from '../middlewares/authMiddleware.js'
import { CreateProductController, GetProductController, GetSingleProductController,realtedProductController, ProductPhotoController, DeleteProductController, UpdateProductController, productFiltersController, productCountController, productListController } from '../controllers/ProductController.js'
import ExpressFormidable from 'express-formidable'

const router = express.Router()

// Routes
router.post('/create-product', requireSignIn, isAdmin, ExpressFormidable(), CreateProductController)

router.get('/get-product', GetProductController)

router.get('/get-product/:slug', GetSingleProductController)

router.get('/product-photo/:pid', ProductPhotoController)

router.delete('/delete-product/:pid', DeleteProductController)

router.put('/update-product/:pid', requireSignIn, isAdmin, ExpressFormidable(), UpdateProductController)

router.post('/product-filters', productFiltersController)

//product count
router.get("/product-count", productCountController);

//product per page
router.get("/product-list/:page", productListController);

//similar product
router.get("/related-product/:pid/:cid", realtedProductController);

export default router
