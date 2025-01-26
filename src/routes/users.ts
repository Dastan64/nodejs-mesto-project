import { Router } from 'express'
import { createUser, getUsers } from '../controllers/users'

const router = Router()

router.get('/', getUsers)
router.post('/', createUser)

export default router
