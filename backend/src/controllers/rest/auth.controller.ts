import { Request, Response } from 'express'
import { register, authenticate } from '../../services/auth.service'

export const registerUser = async (req: Request, res: Response) => {
  try {
    const { email, password, name } = req.body
    const user = await register(email, password, name)
    res.status(201).json({ id: user._id, email: user.email, name: user.name })
  } catch (error: any) {
    res.status(400).json({ message: error.message })
  }
}

export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body
    const { user, token } = await authenticate(email, password)
    res.json({ token, user: { id: user._id, email: user.email, name: user.name } })
  } catch (error: any) {
    res.status(401).json({ message: error.message })
  }
}

export const getProfile = async (req: Request, res: Response) => {
  if (!req.user) return res.status(401).json({ message: 'Unauthorized' })
  res.json({
    id: req.user._id,
    email: req.user.email,
    name: req.user.name,
    role: req.user.role,
    addresses: req.user.addresses
  })
}
