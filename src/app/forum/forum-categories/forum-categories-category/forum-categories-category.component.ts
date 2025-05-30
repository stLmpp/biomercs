import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, input, output } from '@angular/core';
import { CategoryWithSubCategories } from '@model/forum/category';
import { SubCategoryModalService } from '../../service/sub-category-modal.service';
import { arrayUtil } from 'st-utils';
import { trackById } from '@util/track-by';
import { mdiAccountTie } from '@mdi/js';
import { SubCategoryModeratorModalService } from '../../service/sub-category-moderator-modal.service';
import { SubCategory, SubCategoryWithModeratorsInfo } from '@model/forum/sub-category';
import { CdkDrag, CdkDragDrop, CdkDragHandle, CdkDropList } from '@angular/cdk/drag-drop';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { IconComponent } from '../../../shared/components/icon/icon.component';
import { ListDirective, ListSelectable } from '../../../shared/components/list/list.directive';
import { ListItemComponent } from '../../../shared/components/list/list-item.component';
import { RouterLink } from '@angular/router';
import { PrefixDirective } from '../../../shared/components/common/prefix.directive';
import { ListItemLineDirective } from '../../../shared/components/list/list-item-line.directive';
import { SuffixDirective } from '../../../shared/components/common/suffix.directive';
import { IconMdiComponent } from '../../../shared/components/icon/icon-mdi.component';
import { DecimalPipe } from '@angular/common';
import { AuthDateFormatPipe } from '../../../auth/shared/auth-date-format.pipe';

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
  imports: [
    ButtonComponent,
    IconComponent,
    ListDirective,
    ListSelectable,
    CdkDropList,
    ListItemComponent,
    CdkDrag,
    RouterLink,
    PrefixDirective,
    CdkDragHandle,
    ListItemLineDirective,
    SuffixDirective,
    IconMdiComponent,
    DecimalPipe,
    AuthDateFormatPipe,
  ],
})
export class ForumCategoriesCategoryComponent {
  private subCategoryModalService = inject(SubCategoryModalService);
  private changeDetectorRef = inject(ChangeDetectorRef);
  private subCategoryModeratorModalService = inject(SubCategoryModeratorModalService);

  readonly category = input.required<CategoryWithSubCategories>();
  readonly isAdmin = input(false);
  readonly isMobile = input(false);
  readonly loadingAddEditModal = input(false);
  readonly idCategoriesDropList = input<string[]>([]);
  readonly idCategoryDropList = input('');

  readonly openAddEditModal = output<number>();
  readonly categoryChange = output<CategoryWithSubCategories>();
  readonly orderChange = output<ForumCategoriesCategoryComponentOrderChangeEvent>();

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
    const modalRef = await this.subCategoryModalService.openAddEdit({ idSubCategory, idCategory: this.category().id });
    modalRef.onClose$.subscribe(subCategory => {
      if (!subCategory) {
        return;
      }
      const subCategories = arrayUtil(this.category().subCategories)
        .upsert(subCategory.id, subCategory)
        .orderBy('order')
        .toArray();
      this.category = { ...this.category(), subCategories };
      this.categoryChange.emit(this.category());
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
      const subCategories = arrayUtil(this.category().subCategories).update(subCategory.id, { moderators }).toArray();
      this.category = { ...this.category(), subCategories };
      this.categoryChange.emit(this.category());
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
    this.orderChange.emit({ cdkDragDrop, idCategory: this.category().id });
  }
}
