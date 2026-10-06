import { randomBytes } from 'node:crypto'
export const mintToken = (bytes = 16) => randomBytes(bytes).toString('hex')
