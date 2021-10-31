export interface Notification {
  id: number;
  content: string;
  idUser: number;
  read: boolean;
  seen: boolean;
  idNotificationType?: number;
  extra?: NotificationExtra;
}

export type NotificationExtra = NotificationExtraScore | NotificationExtraPost;

export interface NotificationExtraScore {
  idScore: number;
  idScoreStatus: number;
}

export interface NotificationExtraPost {
  idCategory: number;
  idSubCategory: number;
  pageSubCategory: number;
  idTopic: number;
  pageTopic: number;
  idPost: number;
}

export function isNotificationExtraScore(extra: NotificationExtra): extra is NotificationExtraScore {
  return !!(extra as NotificationExtraScore).idScore;
}

export function isNotificationExtraPost(extra: NotificationExtra): extra is NotificationExtraPost {
  return !!(extra as NotificationExtraPost).idPost;
}
