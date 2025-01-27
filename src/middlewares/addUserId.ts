import { NextFunction, Request, Response } from 'express'
import { AuthContext } from '../types/types'

const addUserId = (
  _req: Request,
  res: Response<unknown, AuthContext>,
  next: NextFunction,
) => {
  res.locals.user = {
    _id: '67961cc2b9c038c5cda4a317',
  }
  next()
}

export default addUserId
