import { model, Schema } from 'mongoose'

interface Card {
  name: string
  link: string
  owner: Schema.Types.ObjectId
  likes: Schema.Types.ObjectId[]
  createdAt: Date
}

const cardSchema = new Schema<Card>({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  link: {
    type: String,
    required: true,
    validate: {
      validator(link: string) {
        const regexp =
          /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w.-]+)+[\w\-._~:/?#[\]@!$&'()*+,;=.]+$/
        return regexp.test(link)
      },
      message: 'Некорректная ссылка',
    },
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  likes: [
    {
      type: Schema.Types.ObjectId,
      ref: 'user',
      default: [],
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now(),
  },
})

export default model<Card>('card', cardSchema)
