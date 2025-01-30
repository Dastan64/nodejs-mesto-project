import { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import { AuthContext } from '../types/types'
import { AuthError } from '../errors/auth-error'

export const auth = (
  req: Request,
  res: Response<unknown, AuthContext>,
  next: NextFunction,
) => {
  const { authorization } = req.headers

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return next(new AuthError('Необходима авторизация'))
  }

  const token = authorization.replace('Bearer ', '')
  let payload

  try {
    payload = jwt.verify(token, 'secret-key')
  } catch {
    return next(new AuthError('Необходима авторизация'))
  }
  res.locals.user = payload as { _id: string }

  return next()
}
