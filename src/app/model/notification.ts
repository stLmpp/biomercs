export interface Notification {
  id: string;
  content: string;
  idUser: number;
  read: boolean;
  idScore?: number;
  scoreName?: string;
}
