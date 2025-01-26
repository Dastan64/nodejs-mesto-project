import { Request, Response } from 'express'
import User from '../models/user'

export const getUsers = (req: Request, res: Response) =>
  User.find({})
    .then((users) => res.send(users))
    .catch((err) => {
      res.status(500).send(err)
    })

export const createUser = (req: Request, res: Response) =>
  User.create({
    name: req.body.name,
    about: req.body.about,
    avatar: req.body.avatar,
  })
    .then((user) => res.send(user))
    .catch(() => res.status(500).send({ message: 'Произошла ошибка' }))

export const getUserById = (req: Request, res: Response) => {
  User.findById(req.params.id)
    .then((user) => res.send(user))
    .catch(() => res.status(404).send({ message: 'Пользователь не найден' }))
}
