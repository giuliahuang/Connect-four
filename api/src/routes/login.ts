import express from 'express'
import { login } from '../controllers/login'

const router = express.Router()

router.post('/', express.urlencoded({ extended: true }), express.json(), login)

export default router