export class HttpError extends Error {
  message = 'INTERNAL_SERVER_ERROR'
  statusCode = 500
  field?: { [key: string]: any }

  constructor(error: {
    statusCode: number
    message: { tag: string; field?: { [key: string]: any } }
    description?: string
  }) {
    super(error.description)

    Object.setPrototypeOf(this, new.target.prototype)
    this.message = error.message.tag
    this.field = error.message.field
    this.statusCode = error.statusCode

    Error.captureStackTrace(this)
  }
}
