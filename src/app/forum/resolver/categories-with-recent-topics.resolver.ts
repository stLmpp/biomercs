import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { CategoriesWithRecentTopics } from '@model/forum/category';
import { CategoryService } from '../service/category.service';

export function categoriesWithRecentTopicsResolver(): ResolveFn<CategoriesWithRecentTopics> {
  return () => inject(CategoryService).getAllWithRecentTopics();
}
