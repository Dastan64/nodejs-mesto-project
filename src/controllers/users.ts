import { NextFunction, Request, Response } from 'express'
import { Error } from 'mongoose'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import User from '../models/user'
import { NotFoundError } from '../errors/not-found-error'
import { ValidationError } from '../errors/validation-error'
import { AuthContext } from '../types/types'
import { AuthError } from '../errors/auth-error'
import { ErrorCodes } from '../constants/errors'

export const getUsers = (_req: Request, res: Response, next: NextFunction) =>
  User.find({})
    .then((users) => res.send(users))
    .catch(next)

export const login = (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, 'secret-key', {
        expiresIn: '7d',
      })
      res
        .cookie('jwt', token, {
          maxAge: 10800000,
          httpOnly: true,
          sameSite: true,
        })
        .send({ message: 'Авторизация успешна' })
    })
    .catch((err: unknown) => {
      if (err instanceof AuthError) {
        res.status(ErrorCodes.NOT_AUTHORIZED).send({ message: err.message })
      } else {
        next(err)
      }
    })
}

export const createUser = (req: Request, res: Response, next: NextFunction) => {
  const { name, about, avatar, email, password } = req.body
  bcrypt
    .hash(password, 10)
    .then((hash: string) => {
      User.create({
        name,
        about,
        avatar,
        email,
        password: hash,
      })
    })
    .then((user) => res.status(201).send(user))
    .catch((err: unknown) => {
      if (err instanceof Error.ValidationError) {
        next(new ValidationError('Переданы некорректные данные'))
      } else {
        next(err)
      }
    })
}

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
