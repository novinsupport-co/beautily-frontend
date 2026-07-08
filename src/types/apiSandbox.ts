export interface ApiSandboxRequest {
  url: string
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
  headers: { key: string; value: string }[]
  body: string
  files: File[]
}
