import { SubCategoryWithModeratorsInfo } from '@model/forum/sub-category';
import { TopicRecent } from '@model/forum/topic';

export interface Category {
  id: number;
  name: string;
  deletedDate?: Date;
  order: number;
}

export interface CategoryWithSubCategories extends Category {
  subCategories: SubCategoryWithModeratorsInfo[];
}

export interface CategoryAddDto {
  name: string;
}

export interface CategoryUpdateDto {
  name: string | undefined;
  deleted: boolean;
  restored: boolean;
}

export interface CategoriesWithRecentTopics {
  categories: CategoryWithSubCategories[];
  recentTopics: TopicRecent[];
}
