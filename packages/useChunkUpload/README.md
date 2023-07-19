# useChunkUpload

Chunks file and uploads chunks

## Getting started

Example of how hook is roughly used
```tsx
import { ChunkedFile, useChunkUpload, ChunkedUploadSuccess } from 'useChunkUpload'

interface UploadResult {
  fileId: string
  uploaded: boolean
  uploadUid: string
}

interface UploadFile extends File {
  uid: string
  percent?: number
  chunkedFile?: ChunkedFile
}

export default function Upload() {
  const [fileList, setFileList] = useState<UploadFile[]>([])
  const { uploadFile, retryUpload } = useChunkUpload<UploadResult>('https://example.com')

  function handleUploadResolved(result: ChunkedUploadSuccess<UploadResult>) {
    setFileList((prevState) => {
      const copyFl = [...prevState]
      const f = copyFl.find((x) => x.uid === result.result.uploadUid)
      if (!f) return prevState

      f.percent = 100
      return copyFl
    })
  }

  function handleUploadRejected(error: unknown, uid: string) {
    // uploadFile and retryUpload should ONLY throw UploadFailedError
    if (error instanceof UploadFailedError) {
      const { chunkedFile } = error
      return setFileList((prevState) => {
        const copyFl = [...prevState]
        const f = copyFl.find((x) => x.uid === uid)
        if (!f) return prevState

        f.status = 'error'
        f.chunkedFile = chunkedFile
        return copyFl
      })
    }
    console.error(error)
  }

  function handleUpload(f: File) {
    const file = { ...f, uid: randomUid() }
    setFileList((prevState) => {
      return [file, ...prevState]
    })

    uploadFile(file, file.uid, (progress, uid) => {
      setFileList((prevState) => {
        const copyFl = [...prevState]
        const f = copyFl.find((fi) => fi.uid === uid)
        if (!f) return prevState
        f.percent = Math.floor(progress * 100)

        return copyFl
      })
    })
      .then(handleUploadResolved)
      .catch((error) => handleUploadRejected(error, file.uid))
  }

  function handleRetry(file: CustomUploadFile) {
    if (!file.chunkedFile) return

    const { chunkedFile } = file
    retryUpload(chunkedFile)
      .then(handleUploadResolved)
      .catch((error) => handleUploadRejected(error, chunkedFile.uid))
  }

  return <UploadZone files={fileList} onUpload={handleUpload} onRetry={handleRetry} />
}
```

## Formdata

Provide callback function that sets desired data. Default is provided below

```tsx
function X() {
  const { uploadFile, retryUpload } = useChunkUpload('https://www.example.com', {
    setFormData: (chunk, chunkedFile) => {
      const data = new FormData()
      const blob = new Blob([chunk.blob], { type: chunkedFile.originalFile.type })
      data.append('file', blob, chunkedFile.originalFile.name)
      data.append('metadata.uploadUid', chunkedFile.uid)
      data.append('metadata.chunkIndex', chunk.index.toString())
      data.append('metadata.totalChunks', chunkedFile.chunks.length.toString())
      data.append('metadata.totalFileSize', chunkedFile.originalFile.size.toString())
      return data
    },
  })
}
```
