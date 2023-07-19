import { Chunk, ChunkedFile } from './public-types'

export interface RequestOptions {
  setFormData?: (chunk: Chunk, chunkedFile: ChunkedFile) => FormData
  chunkSize?: number
  progressPollInterval?: number
  headers?: {
    Authorization?: string
  }
}

export interface RequestOptionsWithDefaults extends RequestOptions {
  progressPollInterval: number
  chunkSize: number
  headers: {
    Authorization?: string
  }
}
