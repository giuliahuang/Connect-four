import express from 'express'
import { signup } from '../controllers/signup'

const router = express.Router()
router.post('/', express.urlencoded({ extended: true }), express.json(), signup)

export = router