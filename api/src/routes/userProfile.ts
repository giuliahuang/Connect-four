import { getUserProfile } from '../controllers/userProfile'
import router from './auth'

router.get('/profile', getUserProfile)