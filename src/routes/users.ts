import { Router } from 'express'
import {
  getCurrentUser,
  getUserById,
  getUsers,
  updateUserAvatar,
  updateUserInfo,
} from '../controllers/users'
import {
  validateAvatarUpdate,
  validateUserId,
} from '../constants/request-validators'

const router = Router()

router.get('/', getUsers)
router.get('/me', getCurrentUser)
router.get('/:id', validateUserId, getUserById)
router.patch('/me', updateUserInfo)
router.patch('/me/avatar', validateAvatarUpdate, updateUserAvatar)

export default router
