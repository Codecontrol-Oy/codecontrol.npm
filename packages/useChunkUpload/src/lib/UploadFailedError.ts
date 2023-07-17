import { ChunkedFile } from './core'

export default class UploadFailedError extends Error {
  chunkedFile: ChunkedFile
  originalError?: Error

  constructor(message: string, chunkedFile: ChunkedFile, originalError?: Error) {
    super(message)
    this.chunkedFile = chunkedFile
    this.originalError = originalError
  }
}
