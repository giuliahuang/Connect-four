import { Router } from 'express'
import passport from 'passport'
import friendsRouter from './friends'
import profileRouter from './profile'
import searchRouter from './search'
import sudoRouter from './sudo'

const router = Router()

/**
 * Dummy route used for authenticating all requests in this router hierarchy
 */
router.use(passport.authenticate('jwt', { session: false }))
router.use('/friends', friendsRouter)
router.use('/search', searchRouter)
router.use('/sudo', sudoRouter)
router.use('/profile', profileRouter)

export default router