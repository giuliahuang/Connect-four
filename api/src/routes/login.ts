import express from 'express'
import { login } from '../controllers/login'
import { newPassword, changePassword } from '../controllers/userPassword'

const router = express.Router()

router.post('/', express.urlencoded({ extended: true }), express.json(), login)
router.post('/first', express.urlencoded({ extended: true }), express.json(), newPassword)
router.post('/newpassword', express.urlencoded({ extended: true }), express.json(), changePassword)

export default router