import express from 'express'
import controller from '../controllers/signup'
const router = express.Router()

router.post('/users', controller.signup)
export = router