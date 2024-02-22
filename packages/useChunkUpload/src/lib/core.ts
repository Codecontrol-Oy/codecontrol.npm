import { UploadFailedError } from './UploadFailedError'
import { RequestOptionsWithDefaults } from './internal-types'
import { Chunk, ChunkedFile, ChunkedUploadSuccess, UploadCallback } from './public-types'

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

async function uploadFileChunk<T>(
  url: string,
  chunk: Chunk,
  chunkedFile: ChunkedFile,
  options: RequestOptionsWithDefaults
) {
  let data: FormData
  if (options.setFormData) {
    data = options.setFormData(chunk, chunkedFile)
  } else {
    data = new FormData()
    const blob = new Blob([chunk.blob], { type: chunkedFile.originalFile.type })
    data.append('file', blob, chunkedFile.originalFile.name)
    data.append('metadata.uploadUid', chunkedFile.uid)
    data.append('metadata.chunkIndex', chunk.index.toString())
    data.append('metadata.totalChunks', chunkedFile.chunks.length.toString())
    data.append('metadata.totalFileSize', chunkedFile.originalFile.size.toString())
  }

  const xhr = new XMLHttpRequest()
  const success = await new Promise((resolve) => {
    xhr.upload.addEventListener('progress', (event) => {
      if (event.lengthComputable) {
        chunk.uploaded = chunk.blob.size < event.loaded ? chunk.blob.size : event.loaded
        if (chunkedFile.callback) chunkedFile.callback(getProgress(chunkedFile), chunkedFile.uid)
      }
    })
    xhr.addEventListener('loadend', () => {
      resolve(xhr.readyState === 4 && Math.floor(xhr.status / 100) === 2)
    })
    xhr.open('POST', url, true)

    //xhr headers and withCredentials need to be after open
    if (options.headers.Authorization) {
      xhr.setRequestHeader('Authorization', options.headers.Authorization)
    }
    xhr.withCredentials = options.withCredentials

    xhr.send(data)
  })

  const response = JSON.parse(xhr.response)

  if (success) {
    chunk.isUploaded = true
    return response as T
  }

  chunk.isUploaded = false
  chunk.uploaded = 0
  throw new UploadFailedError('Upload failed', chunkedFile, response)
}

export async function uploadChunkedFile<T>(
  url: string,
  chunkedFile: ChunkedFile,
  options: RequestOptionsWithDefaults
): Promise<ChunkedUploadSuccess<T>> {
  try {
    const chunks = chunkedFile.chunks.filter((c) => !c.uploaded)
    const chunkCount = chunks.length

    if (chunkCount >= 2) await uploadFileChunk<T>(url, chunks[0], chunkedFile, options)

    const middlePartsUploadPromises = chunks
      .slice(1, -1)
      .map((chunk) => uploadFileChunk<T>(url, chunk, chunkedFile, options))
    await Promise.all(middlePartsUploadPromises)
    const last = await uploadFileChunk<T>(url, chunks[chunkCount - 1], chunkedFile, options)

    if (!last) throw new UploadFailedError('Failed to upload', chunkedFile)

    return {
      result: last,
      file: chunkedFile.originalFile,
      uid: chunkedFile.uid,
    }
  } catch (error) {
    if (error instanceof UploadFailedError) {
      throw error
    }
    if (error instanceof Error) {
      throw new UploadFailedError(error.message, chunkedFile, undefined, error)
    }
    throw new UploadFailedError('No actual error was thrown', chunkedFile)
  }
}

export function getProgress(chunkedFile: ChunkedFile) {
  const uploaded = chunkedFile.chunks.reduce((prev, cur) => prev + cur.uploaded, 0)
  return uploaded / chunkedFile.originalFile.size
}
