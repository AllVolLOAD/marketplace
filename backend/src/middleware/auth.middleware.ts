import { Request, Response, NextFunction } from 'express'
import { verifyToken } from '../services/auth.service'

export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
  const header = req.header('Authorization')
  if (!header?.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Missing token' })
  }
  const token = header.replace(/^Bearer\s+/, '')
  const user = await verifyToken(token)
  if (!user) {
    return res.status(401).json({ message: 'Invalid token' })
  }
  req.user = user
  next()
}

export const requireAdmin = (req: Request, res: Response, next: NextFunction) => {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ message: 'Admin required' })
  }
  next()
}
