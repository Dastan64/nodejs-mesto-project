import { Request, Response } from 'express'
import { ErrorCodes } from '../constants/errors'

interface CustomError extends Error {
  statusCode?: number
}

export const handleError = (err: CustomError, _req: Request, res: Response) => {
  const { statusCode = ErrorCodes.SERVER_ERROR, message } = err

  res.status(statusCode).send({
    message:
      statusCode === ErrorCodes.SERVER_ERROR
        ? 'На сервере произошла ошибка'
        : message,
  })
}
