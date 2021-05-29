import router from './auth'
import { getUserStats } from '../controllers/userStats'

router.get('/stats', getUserStats)