import express, { NextFunction, Request, Response } from 'express'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'
import mongoose from 'mongoose'
import { errors } from 'celebrate'

import usersRouter from './routes/users'
import cardsRouter from './routes/cards'

import { handleError } from './middlewares/handleError'
import { auth } from './middlewares/auth'
import { errorLogger, requestLogger } from './middlewares/logger'

import { NotFoundError } from './errors/not-found-error'

import { createUser, login } from './controllers/users'

import {
  validateCreateUser,
  validateLogin,
} from './constants/request-validators'

dotenv.config()

const { PORT = 3000 } = process.env

const app = express()

app.use(express.json())
app.use(cookieParser())
app.use(express.urlencoded({ extended: true }))

mongoose
  .connect('mongodb://localhost:27017/mestodb')
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err))

app.use(requestLogger)

app.post('/signin', validateLogin, login)
app.post('/signup', validateCreateUser, createUser)

app.use(auth)

app.use('/users', usersRouter)
app.use('/cards', cardsRouter)

app.use((_req: Request, _res: Response, next: NextFunction) => {
  next(new NotFoundError('Маршрут не найден'))
})

app.use(errorLogger)
app.use(errors())
app.use(handleError)

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`)
})
