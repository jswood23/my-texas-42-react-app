export const limitString = (input: string, limit: number) =>
  input.length > limit ? `${input.slice(0, limit)}...` : input
