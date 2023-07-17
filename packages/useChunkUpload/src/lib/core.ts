import UploadFailedError from './UploadFailedError'
import { RequestOptionsWithDefaults } from './use-chunk-upload'

//region types
export interface Chunk {
  blob: Blob
  index: number
  isUploaded: boolean
  uploaded: number
}
export interface ChunkedFile {
  chunks: Chunk[]
  originalFile: File
  uid: string
  callback?: UploadCallback
}

export type UploadCallback = (progress: number) => void
export interface ChunkedUploadSuccess<T> {
  result: T
  file: File
  uid: string
}
//endregion

export function getChunkedFile(file: File, chunkSize: number, uid: string, callback?: UploadCallback): ChunkedFile {
  let start = 0
  let end = chunkSize
  const chunks: Chunk[] = []

  while (start < file.size) {
    chunks.push({ blob: file.slice(start, end), index: chunks.length, isUploaded: false, uploaded: 0 })
    start = end
    end = start + chunkSize
  }

  return {
    chunks,
    originalFile: file,
    uid,
    callback,
  }
}

// export function getChunkedFiles(files: File | File[] | FileList, chunkSize: number, uid: string) {
//   let chunkedFiles: ChunkedFile[]
//   if (files instanceof FileList) {
//     const tempFiles: File[] = []
//     for (let i = 0; i < files.length; i++) {
//       const item = files.item(i)
//       if (item) tempFiles.push(item)
//     }
//     chunkedFiles = tempFiles.map((f) => chunkFile(f, chunkSize, uid))
//   } else if (Array.isArray(files)) {
//     chunkedFiles = files.map((f) => chunkFile(f, chunkSize, uid))
//   } else {
//     chunkedFiles = [chunkFile(files, chunkSize, uid)]
//   }
//   return chunkedFiles
// }

async function uploadFileChunk<T>(
  url: string,
  chunk: Chunk,
  chunkedFile: ChunkedFile,
  cb: (n: number) => void,
  options: RequestOptionsWithDefaults
) {
  const headers = new Headers()
  if (options.headers.Authorization) headers.append('Authorization', options.headers.Authorization)

  const data = new FormData()
  const blob = new Blob([chunk.blob], { type: chunkedFile.originalFile.type })
  if (options.setFormData) {
    options.setFormData(data, chunk, chunkedFile)
  } else {
    data.append('file', blob, chunkedFile.originalFile.name)
    data.append('metadata.uploadUid', chunkedFile.uid)
    data.append('metadata.chunkIndex', chunk.index.toString())
    data.append('metadata.totalChunks', chunkedFile.chunks.length.toString())
    data.append('metadata.totalFileSize', chunkedFile.originalFile.size.toString())
  }
  const xhr = new XMLHttpRequest()
  await new Promise((resolve) => {
    xhr.upload.addEventListener('progress', (event) => {
      if (event.lengthComputable) {
        chunk.uploaded = chunk.blob.size < event.loaded ? chunk.blob.size : event.loaded
        cb(getProgress(chunkedFile))
      }
    })
    xhr.addEventListener('loadend', () => {
      console.log('finished')
      chunk.isUploaded = true
      resolve(xhr.readyState === 4 && xhr.status === 200)
    })
    xhr.open('POST', url, true)
    xhr.send(data)
  })

  return JSON.parse(xhr.response) as T
}

export async function uploadChunkedFile<T>(
  url: string,
  chunkedFile: ChunkedFile,
  options: RequestOptionsWithDefaults,
  cb: (n: number) => void
): Promise<ChunkedUploadSuccess<T>> {
  try {
    const chunkCount = chunkedFile.chunks.length
    if (chunkCount >= 2) await uploadFileChunk<T>(url, chunkedFile.chunks[0], chunkedFile, cb, options)
    const middlePartsUploadPromises = chunkedFile.chunks
      .slice(1, -1)
      .filter((chunk) => !chunk.uploaded)
      .map((chunk) => uploadFileChunk<T>(url, chunk, chunkedFile, cb, options))
    await Promise.all(middlePartsUploadPromises)
    const last = await uploadFileChunk<T>(url, chunkedFile.chunks[chunkCount - 1], chunkedFile, cb, options)

    if (!last) throw new UploadFailedError('Failed to upload', chunkedFile)

    return {
      result: last,
      file: chunkedFile.originalFile,
      uid: chunkedFile.uid,
    }
  } catch (error) {
    if (error instanceof Error) {
      throw new UploadFailedError(error.message, chunkedFile, error)
    }
    throw new UploadFailedError('No error message was thrown', chunkedFile)
  }
}

export function getProgress(chunkedFile: ChunkedFile) {
  const uploaded = chunkedFile.chunks.reduce((prev, cur) => prev + cur.uploaded, 0)
  return uploaded / chunkedFile.originalFile.size
}
