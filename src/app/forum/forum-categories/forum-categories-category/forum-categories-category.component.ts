import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, Output } from '@angular/core';
import { CategoryWithSubCategories } from '@model/forum/category';
import { SubCategoryModalService } from '../../service/sub-category-modal.service';
import { arrayUtil } from 'st-utils';
import { trackById } from '@util/track-by';
import { mdiAccountTie } from '@mdi/js';

@Component({
  selector: 'bio-forum-categories-category',
  templateUrl: './forum-categories-category.component.html',
  styleUrls: ['./forum-categories-category.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ForumCategoriesCategoryComponent {
  constructor(private subCategoryModalService: SubCategoryModalService, private changeDetectorRef: ChangeDetectorRef) {}

  @Input() category!: CategoryWithSubCategories;
  @Input() isAdmin = false;
  @Input() isMobile = false;
  @Input() loadingAddEditModal = false;

  @Output() readonly openAddEditModal = new EventEmitter<number>();
  @Output() readonly categoryChange = new EventEmitter<CategoryWithSubCategories>();

  loadingSubCategoryAddEditModal = false;

  readonly trackById = trackById;
  readonly mdiAccountTie = mdiAccountTie;

  async openAddEditSubCategory(idSubCategory?: number, $event?: MouseEvent): Promise<void> {
    if ($event) {
      $event.stopPropagation();
      $event.preventDefault();
    }
    this.loadingSubCategoryAddEditModal = true;
    const modalRef = await this.subCategoryModalService.openAddEdit({ idSubCategory, idCategory: this.category.id });
    modalRef.onClose$.subscribe(subCategory => {
      if (!subCategory) {
        return;
      }
      const subCategories = arrayUtil(this.category.subCategories)
        .upsert(subCategory.id, subCategory)
        .orderBy('order')
        .toArray();
      this.category = { ...this.category, subCategories };
      this.categoryChange.emit(this.category);
    });
    this.loadingSubCategoryAddEditModal = false;
    this.changeDetectorRef.markForCheck();
  }
}
