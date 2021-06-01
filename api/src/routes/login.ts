import express from 'express'
import { login } from '../controllers/login'
import { newPassword } from '../controllers/userPassword'

const router = express.Router()

router.post('/', express.urlencoded({ extended: true }), express.json(), login)
router.post('/first', express.urlencoded({ extended: true }), express.json(), newPassword)

export default router