import express from 'express'
import { registerController, loginController, testController, forgotPasswordController, updateProfileController } from '../controllers/authController.js'
import { requireSignIn, isAdmin } from '../middlewares/authMiddleware.js'

//router object
const router = express.Router()

//routing 

//Register || POST
router.post('/register', registerController)

//Login || POST
router.post('/login', loginController)

router.get('/test', requireSignIn, isAdmin, testController)

//protected User Route
router.get('/user-auth', requireSignIn, (req, res) => {
    res.status(200).send({ ok: true })
})

//protected Admin Route
router.get('/admin-auth', requireSignIn, isAdmin, (req, res) => {
    res.status(200).send({ ok: true })
})

router.post('/forgot-password', forgotPasswordController)

//update profile
router.put("/profile", requireSignIn, updateProfileController);

export default router