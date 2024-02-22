import { Chunk, ChunkedFile } from './public-types'

export interface RequestOptions {
  setFormData?: (chunk: Chunk, chunkedFile: ChunkedFile) => FormData
  chunkSize?: number
  progressPollInterval?: number
  withCredentials?: boolean
  headers?: {
    Authorization?: string
  }
}

export interface RequestOptionsWithDefaults extends RequestOptions {
  progressPollInterval: number
  chunkSize: number
  withCredentials: boolean
  headers: {
    Authorization?: string
  }
}
