import { UserModel, IUser } from '../models/user.model'
import { Types } from 'mongoose'

export const createUser = async (user: Partial<IUser>) => {
  return UserModel.create(user)
}

export const findUserByEmail = async (email: string) => {
  return UserModel.findOne({ email }).lean()
}

export const findUserById = async (id: string) => {
  if (!Types.ObjectId.isValid(id)) return null
  return UserModel.findById(id)
}

export const listUsers = () => {
  return UserModel.find().lean()
}
