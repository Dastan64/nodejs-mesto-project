import { ErrorCodes } from '../constants/errors'

export class UnauthorizedError extends Error {
  statusCode: number

  constructor(message: string) {
    super(message)
    this.statusCode = ErrorCodes.NOT_AUTHORIZED
  }
}
