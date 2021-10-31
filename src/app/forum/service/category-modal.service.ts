import { Injectable } from '@angular/core';
import { ModalService } from '@shared/components/modal/modal.service';
import { ModalRef } from '@shared/components/modal/modal-ref';
import type { ForumCategoryAddEditComponent } from '../forum-category-add-edit/forum-category-add-edit.component';
import { Category } from '@model/forum/category';

@Injectable({ providedIn: 'root' })
export class CategoryModalService {
  constructor(private modalService: ModalService) {}

  async openAddEdit(
    idCategory?: number
  ): Promise<ModalRef<ForumCategoryAddEditComponent, number | undefined, Category>> {
    return this.modalService.openLazy(
      () =>
        import('../forum-category-add-edit/forum-category-add-edit.component').then(
          m => m.ForumCategoryAddEditComponent
        ),
      {
        data: idCategory,
        module: () =>
          import('../forum-category-add-edit/forum-category-add-edit.module').then(m => m.ForumCategoryAddEditModule),
        width: 'clamp(300px, 60vw, 80vw)',
      }
    );
  }
}
