import { OwnerNotification } from '../types'

export interface ChannelSendResult {
  success: boolean
  error?: string
}

export interface NotificationChannel {
  readonly name: string
  send(notification: OwnerNotification): Promise<ChannelSendResult>
}
