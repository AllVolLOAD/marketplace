import { getConfiguration, upsertConfiguration } from '../repos/configuration.repo'
import { IConfiguration } from '../models/configuration.model'

export const fetchConfiguration = () => {
  return getConfiguration()
}

export const updateConfiguration = (payload: Partial<IConfiguration>) => {
  return upsertConfiguration(payload)
}
