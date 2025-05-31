import { Pipe, PipeTransform } from '@angular/core';
import { CategoryWithSubCategories } from '@model/forum/category';

@Pipe({ name: 'forumFilterDeleted' })
export class ForumFilterDeletedPipe implements PipeTransform {
  transform(categories: CategoryWithSubCategories[], hideDeleted: boolean): CategoryWithSubCategories[] {
    if (!hideDeleted) {
      return categories;
    }
    return categories
      .filter(category => !category.deletedDate)
      .map(category => ({
        ...category,
        subCategories: category.subCategories.filter(subCategory => !subCategory.deletedDate),
      }));
  }
}
