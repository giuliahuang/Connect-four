import express from 'express'
import controller from '../controllers/gameplay' 
const router = express.Router()

router.get('/', controller.gameplayCheck)

export = router