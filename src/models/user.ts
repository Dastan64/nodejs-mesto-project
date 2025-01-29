import { model, Schema } from 'mongoose'
import isEmail from 'validator/es/lib/isEmail'

export interface IUser {
  name: string
  about: string
  avatar: string
  email: string
  password: string
}

const userSchema = new Schema<IUser>({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
    default: 'Жак-Ив Кусто',
  },
  about: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
    default: 'Исследователь',
  },
  avatar: {
    type: String,
    required: true,
    default:
      'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
  },
  email: {
    type: String,
    required: true,
    validate: {
      validator(email: string) {
        return isEmail(email)
      },
      message: 'Email некорректен',
    },
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
})

export default model<IUser>('user', userSchema)
