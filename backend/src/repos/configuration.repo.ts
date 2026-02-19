import { ConfigurationModel, IConfiguration } from '../models/configuration.model'

export const getConfiguration = async () => {
  const doc = await ConfigurationModel.findOne()
  return doc?.toObject()
}

export const upsertConfiguration = (data: Partial<IConfiguration>) => {
  return ConfigurationModel.findOneAndUpdate({}, data, {
    upsert: true,
    new: true,
    setDefaultsOnInsert: true
  })
}
