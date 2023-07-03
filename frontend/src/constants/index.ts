import { type UserData } from '../types'

export const requireLoginPages = ['/profile']

export const defaultUserData: UserData = {
  exists: false,
  username: ''
}
