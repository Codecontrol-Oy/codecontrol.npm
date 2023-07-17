# useChunkUpload
Chunks file and uploads chunks

## Formdata
Provide callback function that sets desired data

```tsx
function X() {
  const { uploadFile } = useChunkUpload('https://www.example.com', {
    setFormData: (formData, chunk, chunkedFile) => {
      formData.append('file', new Blob([chunk.blob], { type: chunkedFile.originalFile.type }), chunkedFile.originalFile.name)
      formData.append('metadata.uploadUid', uidGenerator())
      formData.append('metadata.chunkIndex', chunk.index.toString())
      formData.append('metadata.totalChunks', chunkedFile.chunks.length.toString())
      formData.append('metadata.totalFileSize', chunkedFile.originalFile.size.toString())
    },
  })
}
```
