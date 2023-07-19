export type Chunk = {
  blob: Blob
  index: number
  isUploaded: boolean
  uploaded: number
}

export type ChunkedFile = {
  chunks: Chunk[]
  originalFile: File
  uid: string
  callback?: UploadCallback
}

export type UploadCallback = (progress: number, uid: string) => void

export type ChunkedUploadSuccess<T> = {
  result: T
  file: File
  uid: string
}
