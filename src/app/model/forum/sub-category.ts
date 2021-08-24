import { Moderator } from '@model/forum/moderator';

export interface SubCategory {
  id: number;
  name: string;
  description: string;
  idCategory: number;
  moderators: Moderator[];
  playerPersonaNameLastPost?: string;
  idPlayerLastPost?: number;
  topicNameLastPost?: string;
  idTopicLastPost?: number;
  lastPostDate?: string;
  topicCount: number;
  postCount: number;
  hasNewPosts: boolean;
  order: number;
}
