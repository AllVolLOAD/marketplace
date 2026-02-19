import { Schema, model, Document } from 'mongoose'

export interface IConfiguration extends Document {
  shipping: {
    flatRate: number
    freeFromSubtotal: number
  }
  tax: {
    percent: number
  }
  currency: string
}

const configurationSchema = new Schema<IConfiguration>(
  {
    shipping: {
      flatRate: { type: Number, required: true },
      freeFromSubtotal: { type: Number, required: true }
    },
    tax: {
      percent: { type: Number, required: true }
    },
    currency: { type: String, required: true }
  },
  { timestamps: true }
)

export const ConfigurationModel = model<IConfiguration>('Configuration', configurationSchema)
