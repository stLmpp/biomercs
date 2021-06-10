export interface MailStatusQueue {
  maxRetries: number;
  retryAttempts: number;
  queueWorking: boolean;
  status: string;
}
