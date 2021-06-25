import express from 'express'
import { login } from '../controllers/login'
import { changeTempPassword } from '../controllers/userPassword'

const router = express.Router()

router.post('/', express.urlencoded({ extended: true }), express.json(), login)
router.post('/first', express.urlencoded({ extended: true }), express.json(), changeTempPassword)

export default router