export class ParamNotFoundError extends Error {
  constructor(paramName: string) {
    super(`param ${paramName} was not provided`)
  }
}
