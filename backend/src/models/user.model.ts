import { Schema, model, Document } from 'mongoose'

export type AddressSnapshot = {
  label: string
  fullName: string
  phone: string
  country: string
  city: string
  zip: string
  line1: string
  line2?: string
}

export interface IUser extends Document {
  email: string
  passwordHash: string
  name: string
  role: 'customer' | 'admin'
  addresses: AddressSnapshot[]
  createdAt: Date
  updatedAt: Date
}

const AddressSchema = new Schema<AddressSnapshot>(
  {
    label: { type: String, required: true },
    fullName: { type: String, required: true },
    phone: { type: String, required: true },
    country: { type: String, required: true },
    city: { type: String, required: true },
    zip: { type: String, required: true },
    line1: { type: String, required: true },
    line2: { type: String }
  },
  { _id: false }
)

const userSchema = new Schema<IUser>(
  {
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    name: { type: String, required: true },
    role: { type: String, enum: ['customer', 'admin'], default: 'customer' },
    addresses: { type: [AddressSchema], default: [] }
  },
  { timestamps: true }
)

export const UserModel = model<IUser>('User', userSchema)
