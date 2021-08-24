import { SubCategoryWithModeratorsInfo } from '@model/forum/sub-category';

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
