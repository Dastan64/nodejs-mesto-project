import { NextFunction, Request, Response } from 'express'
import { ErrorCodes } from '../constants/errors'

interface CustomError extends Error {
  statusCode?: number
}

export const handleError = (
  err: CustomError,
  _req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
  _next: NextFunction,
) => {
  const { statusCode = ErrorCodes.SERVER_ERROR, message } = err

  res.status(statusCode).send({
    message:
      statusCode === ErrorCodes.SERVER_ERROR
        ? 'На сервере произошла ошибка'
        : message,
  })
}
