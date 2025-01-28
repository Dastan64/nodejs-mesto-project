import { NextFunction, Request, Response } from 'express'
import { Error } from 'mongoose'
import User from '../models/user'
import { NotFoundError } from '../errors/not-found-error'
import { ValidationError } from '../errors/validation-error'
import { AuthContext } from '../types/types'

export const getUsers = (_req: Request, res: Response, next: NextFunction) =>
  User.find({})
    .then((users) => res.send(users))
    .catch(next)

export const createUser = (req: Request, res: Response, next: NextFunction) =>
  User.create({
    name: req.body.name,
    about: req.body.about,
    avatar: req.body.avatar,
  })
    .then((user) => res.status(201).send(user))
    .catch((err) => {
      if (err instanceof Error.ValidationError) {
        next(new ValidationError('Переданы некорректные данные'))
      } else {
        next(err)
      }
    })

export const getUserById = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  User.findById(req.params.id)
    .then((user) => {
      if (!user) {
        throw new NotFoundError(
          'Пользователь с таким идентификатором не найден',
        )
      }
      res.send(user)
    })
    .catch(next)
}

export const updateUserInfo = (
  req: Request,
  res: Response<unknown, AuthContext>,
  next: NextFunction,
) => {
  User.findByIdAndUpdate(res.locals.user._id, req.body, {
    new: true,
    runValidators: true,
  })
    .then((user) => {
      if (!user) {
        throw new NotFoundError(
          'Пользователь с таким идентификатором не найден',
        )
      }
      res.send(user)
    })
    .catch((err) => {
      if (err instanceof Error.CastError) {
        next(new ValidationError('Некорректный тип данных'))
      }
      if (err instanceof Error.ValidationError) {
        next(new ValidationError('Переданы некорректные данные'))
      } else {
        next(err)
      }
    })
}

export const updateUserAvatar = (
  req: Request,
  res: Response<unknown, AuthContext>,
  next: NextFunction,
) => {
  User.findByIdAndUpdate(
    res.locals.user._id,
    { avatar: req.body.avatar },
    {
      new: true,
      runValidators: true,
    },
  )
    .then((user) => {
      if (!user) {
        throw new NotFoundError(
          'Пользователь с таким идентификатором не найден',
        )
      }
      res.send(user)
    })
    .catch((err) => {
      if (err instanceof Error.CastError) {
        next(new ValidationError('Некорректный тип данных'))
      }
      if (err instanceof Error.ValidationError) {
        next(new ValidationError('Переданы некорректные данные'))
      } else {
        next(err)
      }
    })
}
