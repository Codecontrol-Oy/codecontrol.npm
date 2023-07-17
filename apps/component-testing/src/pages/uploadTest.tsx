import { useChunkUpload } from '@codecontrol/useChunkUpload'
export default function UploadTest() {
  const { uploadFile } = useChunkUpload('http://localhost:5071/attachments', {
    setFormData(formData, chunk, chunkedFile) {
      formData.append('file', new Blob([chunk.blob], { type: chunkedFile.originalFile.type }), chunkedFile.originalFile.name)
      formData.append('metadata.uploadUid', 'oudosta paikkaa keksitty arvo D:')
      formData.append('metadata.chunkIndex', chunk.index.toString())
      formData.append('metadata.totalChunks', chunkedFile.chunks.length.toString())
      formData.append('metadata.totalFileSize', chunkedFile.originalFile.size.toString())
    },
  })

  const handleUpload = (files: FileList | null) => {
    if (!files) return
    uploadFile(files)
  }

  return (
    <div>
      <input type='file' onChange={(file) => handleUpload(file.target.files)} />
    </div>
  )
}
