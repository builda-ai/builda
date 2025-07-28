export interface MessageItem {
  id: number
  role: 'user' | 'assistant'
  content: string
  loading?: boolean
  audio?: Uint8Array
  audioText?: string
  duration?: number
}
