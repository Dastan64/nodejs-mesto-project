import { Router } from 'express'
import {
  createCard,
  deleteCard,
  dislikeCard,
  getCards,
  likeCard,
} from '../controllers/cards'
import {
  validateCardId,
  validateCreateCard,
} from '../constants/request-validators'

const router = Router()

router.get('/', getCards)
router.post('/', validateCreateCard, createCard)
router.delete('/:id', validateCardId, deleteCard)
router.put('/:id/likes', validateCardId, likeCard)
router.delete('/:id/likes', validateCardId, dislikeCard)

export default router
