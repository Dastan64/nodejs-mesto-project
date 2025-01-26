import { NextFunction, Request, Response } from 'express'
import { AuthContext } from '../types/types'

const addUserId = (
  _req: Request,
  res: Response<unknown, AuthContext>,
  next: NextFunction,
) => {
  res.locals.user = {
    _id: '65ce3b5af85c5bc50f2b202c',
  }
  next()
}

export default addUserId
