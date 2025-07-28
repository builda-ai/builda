export interface MessageItem {
  id: string
  role: 'user' | 'assistant'
  content: string
  loading?: boolean
  audio?: Uint8Array
  duration?: number
}
