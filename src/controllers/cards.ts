import { NextFunction, Request, Response } from 'express'
import { Error as MongooseError } from 'mongoose'
import Card from '../models/card'
import { AuthContext } from '../types/types'
import { NotFoundError } from '../errors/not-found-error'
import { ValidationError } from '../errors/validation-error'
import { ForbiddenError } from '../errors/forbidden-error'

export const getCards = (_req: Request, res: Response, next: NextFunction) =>
  Card.find({})
    .populate('owner')
    .then((cards) => res.send(cards))
    .catch(next)

export const createCard = (
  req: Request,
  res: Response<unknown, AuthContext>,
  next: NextFunction,
) => {
  Card.create({
    name: req.body.name,
    link: req.body.link,
    owner: res.locals.user._id,
  })
    .then((card) => res.status(201).send(card))
    .catch((err) => {
      if (err instanceof MongooseError.ValidationError) {
        next(new ValidationError('Переданы некорректные данные'))
      } else {
        next(err)
      }
    })
}

export const deleteCard = (
  req: Request,
  res: Response<unknown, AuthContext>,
  next: NextFunction,
) => {
  const userId = res.locals.user._id

  Card.findById(req.params.id)
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Карточка не найдена')
      }

      if (card.owner.toString() !== userId) {
        throw new ForbiddenError('Нельзя удалить чужую карточку')
      }

      return Card.findByIdAndDelete(req.params.id)
    })
    .then((deletedCard) => res.status(200).send(deletedCard))
    .catch(next)
}

export const likeCard = (
  req: Request,
  res: Response<unknown, AuthContext>,
  next: NextFunction,
) => {
  Card.findByIdAndUpdate(
    req.params.id,
    { $addToSet: { likes: res.locals.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Такой карточки не существует')
      }
      res.send(card)
    })
    .catch(next)
}

export const dislikeCard = (
  req: Request,
  res: Response<unknown, AuthContext>,
  next: NextFunction,
) => {
  Card.findByIdAndUpdate(
    req.params.id,
    { $pull: { likes: res.locals.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Такой карточки не существует')
      }
      res.send(card)
    })
    .catch(next)
}
