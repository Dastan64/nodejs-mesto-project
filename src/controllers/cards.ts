import { NextFunction, Request, Response } from 'express'
import { Error as MongooseError } from 'mongoose'
import Card from '../models/card'
import { AuthContext } from '../types/types'
import { NotFoundError } from '../errors/not-found-error'
import { ValidationError } from '../errors/validation-error'

export const getCards = (_req: Request, res: Response, next: NextFunction) =>
  Card.find({})
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

export const deleteCard = (req: Request, res: Response, next: NextFunction) => {
  Card.findByIdAndDelete(req.params.id)
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Карточка не найдена')
      }
      res.status(200).send(card)
    })
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
