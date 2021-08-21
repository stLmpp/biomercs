export interface Notification {
  id: number;
  content: string;
  idUser: number;
  read: boolean;
  seen: boolean;
  idScore?: number;
  idScoreStatus?: number;
  idNotificationType?: number;
}
