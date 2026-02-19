import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { config } from '../config'
import { createUser, findUserByEmail, findUserById } from '../repos/user.repo'

export const register = async (email: string, password: string, name: string) => {
  const existing = await findUserByEmail(email)
  if (existing) throw new Error('Email already in use')
  const passwordHash = await bcrypt.hash(password, 10)
  const user = await createUser({
    email,
    passwordHash,
    name,
    role: 'customer'
  })
  return user
}

export const authenticate = async (email: string, password: string) => {
  const user = await findUserByEmail(email)
  if (!user) throw new Error('Invalid credentials')
  const match = await bcrypt.compare(password, user.passwordHash)
  if (!match) throw new Error('Invalid credentials')
  const token = jwt.sign({ userId: user._id.toString(), role: user.role }, config.jwtSecret, {
    expiresIn: '7d'
  })
  return { user, token }
}

export const verifyToken = async (token: string) => {
  try {
    const data = jwt.verify(token, config.jwtSecret) as { userId: string }
    return findUserById(data.userId)
  } catch (error) {
    return null
  }
}
