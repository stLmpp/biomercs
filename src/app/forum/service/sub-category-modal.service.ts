import { Injectable } from '@angular/core';
import { ModalRef } from '@shared/components/modal/modal-ref';
import type {
  ForumSubCategoryAddEditComponent,
  ForumSubCategoryAddEditComponentData,
} from '../forum-sub-category-add-edit/forum-sub-category-add-edit.component';
import { SubCategory } from '@model/forum/sub-category';
import { ModalService } from '@shared/components/modal/modal.service';

@Injectable({ providedIn: 'root' })
export class SubCategoryModalService {
  constructor(private modalService: ModalService) {}

  async openAddEdit(
    data: ForumSubCategoryAddEditComponentData
  ): Promise<ModalRef<ForumSubCategoryAddEditComponent, ForumSubCategoryAddEditComponentData, SubCategory>> {
    return this.modalService.openLazy(
      () =>
        import('../forum-sub-category-add-edit/forum-sub-category-add-edit.component').then(
          m => m.ForumSubCategoryAddEditComponent
        ),
      {
        minWidth: 300,
        data,
        module: () =>
          import('../forum-sub-category-add-edit/forum-sub-category-add-edit.module').then(
            m => m.ForumSubCategoryAddEditModule
          ),
      }
    );
  }
}
