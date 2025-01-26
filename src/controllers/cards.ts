import { Request, Response } from 'express'
import Card from '../models/card'

export const getCards = (req: Request, res: Response) =>
  Card.find({})
    .then((cards) => res.send(cards))
    .catch((err) => {
      res.status(500).send(err)
    })

export const createCard = (req: Request, res: Response) =>
  Card.create({
    name: req.body.name,
    link: req.body.link,
  })
    .then((card) => res.send(card))
    .catch(() => res.status(500).send({ message: 'Произошла ошибка' }))
