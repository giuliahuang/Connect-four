import express from 'express'
import { search } from '../controllers/search'

const router = express.Router()

router.post('/search', express.urlencoded({ extended: true }), express.json(), search)

export default router