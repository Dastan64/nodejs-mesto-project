import { Router } from 'express'
import {
  getCurrentUser,
  getUserById,
  getUsers,
  updateUserAvatar,
  updateUserInfo,
} from '../controllers/users'

const router = Router()

router.get('/', getUsers)
router.get('/me', getCurrentUser)
router.get('/:id', getUserById)
router.patch('/me', updateUserInfo)
router.patch('/me/avatar', updateUserAvatar)

export default router
