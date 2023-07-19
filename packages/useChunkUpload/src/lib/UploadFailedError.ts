import { ChunkedFile } from "./public-types"

export class UploadFailedError extends Error {
  chunkedFile: ChunkedFile
  response?: object
  originalError?: Error

  constructor(message: string, chunkedFile: ChunkedFile, response?: object, originalError?: Error) {
    super(message)
    this.chunkedFile = chunkedFile
    this.response = response
    this.originalError = originalError
  }
}
