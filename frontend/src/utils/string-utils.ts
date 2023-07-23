// This function limits an input string to a given number of characters. If the string goes over that limit, it will have a ... after the allowed characters.
export const limitString = (input: string, limit: number) =>
  input.length > limit ? `${input.slice(0, limit).trim()}...` : input
