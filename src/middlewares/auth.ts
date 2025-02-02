import { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import { AuthContext } from '../types/types'
import { AuthError } from '../errors/auth-error'

dotenv.config()
const { NODE_ENV, JWT_SECRET } = process.env

export const auth = (
  req: Request,
  res: Response<unknown, AuthContext>,
  next: NextFunction,
) => {
  const { cookies } = req

  if (!cookies || !cookies.jwt) {
    return next(new AuthError('Необходима авторизация'))
  }

  let payload

  try {
    payload = jwt.verify(
      cookies.jwt,
      NODE_ENV === 'production' ? JWT_SECRET! : 'secret-key',
    )
  } catch {
    return next(new AuthError('Необходима авторизация'))
  }
  res.locals.user = payload as { _id: string }

  return next()
}
