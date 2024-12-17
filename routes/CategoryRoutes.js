import express from 'express'
import { isAdmin, requireSignIn } from '../middlewares/authMiddleware.js'
import { CreateCategoryController, UpdateCategoryController, CategoryController, SingleCategoryController, DeleteCategoryController } from '../controllers/CategoryController.js'


const router = express.Router()

//routes
router.post('/create-category', requireSignIn, isAdmin, CreateCategoryController)

router.put('/update-category/:id', requireSignIn, isAdmin, UpdateCategoryController)

router.get('/get-category', CategoryController)

router.get('/single-category/:slug', SingleCategoryController)

router.delete('/delete-category/:id', requireSignIn, isAdmin, DeleteCategoryController)



export default router