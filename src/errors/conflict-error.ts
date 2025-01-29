import { ErrorCodes } from '../constants/errors'

export class ConflictError extends Error {
  statusCode: number

  constructor(message: string) {
    super(message)
    this.statusCode = ErrorCodes.CONFLICT
  }
}
