import { useState } from 'react'
import {
  Chunk,
  ChunkedFile,
  ChunkedUploadSuccess,
  UploadCallback,
  chunkFile,
  uploadChunkedFile,
  getProgress,
  getChunkedFiles,
  getChunkedFile,
} from './core'

interface RequestOptions {
  setFormData?: (formdata: FormData, chunk: Chunk, chunkedFile: ChunkedFile) => void
  retryCount?: number
  chunkSize?: number
  progressPollInterval?: number
  headers?: {
    Authorization?: string
  }
}

export interface RequestOptionsWithDefaults extends RequestOptions {
  progressPollInterval: number
  retryCount: number
  chunkSize: number
  headers: {
    Authorization?: string
  }
}

type UploadingFile = {
  chunkedFile: ChunkedFile
  percentage: number
  status: 'uploading' | 'done' | 'error' | 'removed' | 'success'
  uid: string
}
const DEFAULT_CHUNKSIZE = 5 * 1024 * 1024
export function useChunkUpload<T>(
  url: string,
  options: RequestOptions
): { uploadFile: (file: File, uid: string, callback?: UploadCallback) => Promise<ChunkedUploadSuccess<T>> } {
  const [uploadingFiles, setUploadingFiles] = useState<UploadingFile[]>([])
  const defaultOptions: RequestOptionsWithDefaults = {
    retryCount: 3,
    chunkSize: DEFAULT_CHUNKSIZE,
    headers: {},
    progressPollInterval: 500,
  }
  const opt: RequestOptionsWithDefaults = {
    ...defaultOptions,
    ...options,
  }

  const uploadFile = async (file: File, uid: string, callback?: UploadCallback) => {
    const chunkedFile = getChunkedFile(file, opt.chunkSize, uid, callback)

    setUploadingFiles([{ chunkedFile, percentage: 0, status: 'uploading', uid }, ...uploadingFiles])
    const progressInterval = setInterval(() => {
      if (callback) callback(getProgress(chunkedFile))
    }, opt.progressPollInterval)
    const cb = (n: number) => console.log({ n })

    return uploadChunkedFile<T>(url, cb, opt, chunkedFile)
      .then((result) => {
        console.log({ result })
        console.log('finally uploaded')
        console.log(chunkedFile)
        return result
      })
      .catch((error) => console.log(error))
      .finally(() => clearInterval(progressInterval))
  }

  return { uploadFile }
}
