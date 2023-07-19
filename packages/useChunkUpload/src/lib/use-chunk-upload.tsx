import { uploadChunkedFile, getChunkedFile } from './core'
import { RequestOptions, RequestOptionsWithDefaults } from './internal-types'
import { ChunkedFile, UploadCallback } from './public-types'

const DEFAULT_CHUNKSIZE = 5 * 1024 * 1024
export function useChunkUpload<T>(url: string, options: RequestOptions = {}) {
  const defaultOptions: RequestOptionsWithDefaults = {
    chunkSize: DEFAULT_CHUNKSIZE,
    headers: {},
    progressPollInterval: 500,
  }
  const opt: RequestOptionsWithDefaults = {
    ...defaultOptions,
    ...options,
  }

  async function uploadFile(file: File, uid: string, callback?: UploadCallback) {
    const chunkedFile = getChunkedFile(file, opt.chunkSize, uid, callback)
    return uploadChunkedFile<T>(url, chunkedFile, opt)
  }

  async function retryUpload(chunkedFile: ChunkedFile) {
    return uploadChunkedFile<T>(url, chunkedFile, opt)
  }

  return { uploadFile, retryUpload }
}
