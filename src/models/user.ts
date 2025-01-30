import { Document, Model, model, Schema } from 'mongoose'
import isEmail from 'validator/lib/isEmail'
import bcrypt from 'bcrypt'
import { AuthError } from '../errors/auth-error'

export interface IUser {
  name: string
  about: string
  avatar: string
  email: string
  password: string
}

interface UserModel extends Model<IUser> {
  findUserByCredentials: (
    email: string,
    password: string,
  ) => Promise<Document<unknown, any, IUser>>
}

const userSchema = new Schema<IUser, UserModel>({
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
    validate: {
      validator(avatar: string) {
        const regexp =
          /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w.-]+)+[\w\-._~:/?#[\]@!$&'()*+,;=.]+$/
        return regexp.test(avatar)
      },
      message: 'Некорректная ссылка на фото профиля',
    },
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
    select: false,
  },
})

userSchema.static(
  'findUserByCredentials',
  function findUserByCredentials(email: string, password: string) {
    return this.findOne({ email })
      .select('+password')
      .then((user) => {
        if (!user) {
          throw new AuthError('Неправильные почта или пароль')
        }

        return bcrypt
          .compare(password, user.password)
          .then((hasMatch: boolean) => {
            if (!hasMatch) {
              throw new AuthError('Неправильные почта или пароль')
            }

            return user
          })
      })
  },
)

export default model<IUser, UserModel>('user', userSchema)
