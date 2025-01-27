import express from 'express'
import mongoose from 'mongoose'

import usersRouter from './routes/users'
import cardsRouter from './routes/cards'
import addUserId from './middlewares/addUserId'
import { handleError } from './middlewares/catchError'

const { PORT = 3000 } = process.env

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

mongoose
  .connect('mongodb://localhost:27017/mestodb')
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err))

app.use(addUserId)

app.use('/users', usersRouter)
app.use('/cards', cardsRouter)

app.use(handleError)

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`)
})
