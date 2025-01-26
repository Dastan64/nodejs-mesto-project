import { Request, Response } from 'express'
import Card from '../models/card'
import { AuthContext } from '../types/types'

export const getCards = (req: Request, res: Response) =>
  Card.find({})
    .then((cards) => res.send(cards))
    .catch((err) => {
      res.status(500).send(err)
    })

export const createCard = (
  req: Request,
  res: Response<unknown, AuthContext>,
) => {
  Card.create({
    name: req.body.name,
    link: req.body.link,
    owner: res.locals.user._id,
  })
    .then((card) => res.send(card))
    .catch(() => res.status(500).send({ message: 'Произошла ошибка' }))
}

export const deleteCard = (req: Request, res: Response) => {
  Card.findByIdAndDelete(req.params.id)
    .then((card) => res.send(card))
    .catch(() => res.status(500).send({ message: 'Произошла ошибка' }))
}
