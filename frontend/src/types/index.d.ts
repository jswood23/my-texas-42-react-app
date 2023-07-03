export interface UserData {
  exists: boolean
  readonly username: string
}

export type OpenAlert = (message: string, severity: string) => void
