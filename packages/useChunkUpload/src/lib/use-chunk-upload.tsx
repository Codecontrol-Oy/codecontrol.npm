import { useRef, useState } from 'react'
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
export function useChunkUpload<T>(url: string, options: RequestOptions) {
  const [uploadingFiles, setUploadingFiles] = useState<UploadingFile[]>([])
  const uploadRef = useRef<UploadingFile[]>([])
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
    uploadRef.current = [{ chunkedFile, percentage: 0, status: 'uploading', uid }, ...uploadRef.current]
    return uploadChunkedFile<T>(url, chunkedFile, opt, (n) => {
      const file = uploadRef.current.find((f) => f.uid === uid)
      console.log({ file })
      if (!file) return
      file.percentage = Math.floor(100 * n)
      console.log({ uploadFiles: uploadRef.current })
      setUploadingFiles(uploadRef.current)
    })
      .then((result) => {
        console.log({ result })
        console.log('finally uploaded')
        console.log(chunkedFile)
        uploadRef.current = uploadRef.current.filter((x) => x.uid !== uid)
        setUploadingFiles(uploadRef.current)
        return result
      })
      .catch((error) => console.log(error))
  }

  return { uploadFile, uploadingFiles, uploadRef }
}
