import { Router } from 'express'
import {
  createUser,
  getUserById,
  getUsers,
  login,
  updateUserAvatar,
  updateUserInfo,
} from '../controllers/users'

const router = Router()

router.get('/', getUsers)
router.get('/:id', getUserById)
router.post('/signin', login)
router.post('/signup', createUser)
router.patch('/me', updateUserInfo)
router.patch('/me/avatar', updateUserAvatar)

export default router
