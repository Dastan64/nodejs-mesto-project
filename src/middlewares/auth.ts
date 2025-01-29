import { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import { ErrorCodes } from '../constants/errors'
import { AuthContext } from '../types/types'

export const auth = (
  req: Request,
  res: Response<unknown, AuthContext>,
  next: NextFunction,
) => {
  const { authorization } = req.headers

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return res
      .status(ErrorCodes.NOT_AUTHORIZED)
      .send({ message: 'Необходима авторизация' })
  }

  const token = authorization.replace('Bearer ', '')
  let payload

  try {
    payload = jwt.verify(token, 'secret-key')
  } catch {
    return res
      .status(ErrorCodes.NOT_AUTHORIZED)
      .send({ message: 'Необходима авторизация' })
  }
  res.locals.user = payload as { _id: string }

  return next()
}
