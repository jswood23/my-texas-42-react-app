export interface UserData {
  readonly username: string
}

export type OpenAlert = (message: string, severity: string) => void
