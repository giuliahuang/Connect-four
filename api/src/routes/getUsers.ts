import express from 'express'
import controller from '../controllers/getUsers'
const router = express.Router()

router.get('/users', controller.getUsers)

export = router
