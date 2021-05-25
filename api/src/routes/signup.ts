import express from 'express'
import { signup } from '../controllers/signup'

const router = express.Router()
router.post('/', express.urlencoded({ extended: false }), express.json(), signup)

export = router