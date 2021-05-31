import { Router } from 'express'
import passport from 'passport'
import friendsRouter from './friends'
import searchRouter from './search'
import statsRouter from './stats'
import userProfileRouter from './userProfile'

const router = Router()

/**
 * Dummy route use for authenticating all requests in the router hierarchy
 */
router.use(passport.authenticate('jwt', { session: false }))
router.use(friendsRouter)
router.use(searchRouter)
router.use(statsRouter)
router.use(userProfileRouter)

export default router