import { Router } from 'express'
import passport from 'passport'

const router = Router()

router.get('/', passport.authenticate('jwt', { session: false }), (req, res) => {
  res.status(200).json({ message: 'JWT auth succeeded' })
})

export default router