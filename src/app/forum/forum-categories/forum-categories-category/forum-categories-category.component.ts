import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, Output } from '@angular/core';
import { CategoryWithSubCategories } from '@model/forum/category';
import { SubCategoryModalService } from '../../service/sub-category-modal.service';
import { arrayUtil } from 'st-utils';
import { trackById } from '@util/track-by';
import { mdiAccountTie } from '@mdi/js';
import { SubCategoryModeratorModalService } from '../../service/sub-category-moderator-modal.service';
import { SubCategory, SubCategoryWithModeratorsInfo } from '@model/forum/sub-category';
import { CdkDragDrop } from '@angular/cdk/drag-drop/drag-events';

export interface ForumCategoriesCategoryComponentOrderChangeEvent {
  idCategory: number;
  cdkDragDrop: CdkDragDrop<
    SubCategoryWithModeratorsInfo[],
    SubCategoryWithModeratorsInfo[],
    SubCategoryWithModeratorsInfo
  >;
}

@Component({
  selector: 'bio-forum-categories-category',
  templateUrl: './forum-categories-category.component.html',
  styleUrls: ['./forum-categories-category.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ForumCategoriesCategoryComponent {
  constructor(
    private subCategoryModalService: SubCategoryModalService,
    private changeDetectorRef: ChangeDetectorRef,
    private subCategoryModeratorModalService: SubCategoryModeratorModalService
  ) {}

  @Input() category!: CategoryWithSubCategories;
  @Input() isAdmin = false;
  @Input() isMobile = false;
  @Input() loadingAddEditModal = false;
  @Input() idCategoriesDropList: string[] = [];
  @Input() idCategoryDropList = '';

  @Output() readonly openAddEditModal = new EventEmitter<number>();
  @Output() readonly categoryChange = new EventEmitter<CategoryWithSubCategories>();
  @Output() readonly orderChange = new EventEmitter<ForumCategoriesCategoryComponentOrderChangeEvent>();

  loadingSubCategoryAddEditModal = false;
  loadingSubCategoryModeratorManagement = false;

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

  async openSubCategoryModeratorManagement(subCategory: SubCategory, $event: MouseEvent): Promise<void> {
    $event.stopPropagation();
    $event.preventDefault();
    this.loadingSubCategoryModeratorManagement = true;
    const modalRef = await this.subCategoryModeratorModalService.openModeratorManagement({
      idSubCategory: subCategory.id,
      nameSubCategory: subCategory.name,
    });
    modalRef.onClose$.subscribe(moderators => {
      if (!moderators) {
        return;
      }
      const subCategories = arrayUtil(this.category.subCategories).update(subCategory.id, { moderators }).toArray();
      this.category = { ...this.category, subCategories };
      this.categoryChange.emit(this.category);
    });
    this.loadingSubCategoryModeratorManagement = false;
    this.changeDetectorRef.markForCheck();
  }

  onCdkDropListDropped(
    cdkDragDrop: CdkDragDrop<
      SubCategoryWithModeratorsInfo[],
      SubCategoryWithModeratorsInfo[],
      SubCategoryWithModeratorsInfo
    >
  ): void {
    if (
      cdkDragDrop.previousContainer === cdkDragDrop.container &&
      cdkDragDrop.previousIndex === cdkDragDrop.currentIndex
    ) {
      return;
    }
    this.orderChange.emit({ cdkDragDrop, idCategory: this.category.id });
  }
}
