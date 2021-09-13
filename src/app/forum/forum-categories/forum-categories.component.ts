import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CategoryWithSubCategories } from '@model/forum/category';
import { RouteDataEnum } from '@model/enum/route-data.enum';
import { trackById } from '@util/track-by';
import { AuthQuery } from '../../auth/auth.query';
import { CategoryModalService } from '../service/category-modal.service';
import { arrayUtil, isFunction } from 'st-utils';
import { CdkDragDrop } from '@angular/cdk/drag-drop/drag-events';
import { CategoryService } from '../service/category.service';
import { BehaviorSubject, finalize, map } from 'rxjs';
import { BreakpointObserverService } from '@shared/services/breakpoint-observer/breakpoint-observer.service';
import { mdiAccountTie } from '@mdi/js';
import { ModeratorModalService } from '../service/moderator-modal.service';
import { SubCategoryOrderDto } from '@model/forum/sub-category';
import { ForumCategoriesCategoryComponentOrderChangeEvent } from './forum-categories-category/forum-categories-category.component';
import { SubCategoryService } from '../service/sub-category.service';

@Component({
  selector: 'bio-forum-categories',
  templateUrl: './forum-categories.component.html',
  styleUrls: ['./forum-categories.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ForumCategoriesComponent {
  constructor(
    private activatedRoute: ActivatedRoute,
    private authQuery: AuthQuery,
    private categoryModalService: CategoryModalService,
    private changeDetectorRef: ChangeDetectorRef,
    private categoryService: CategoryService,
    private breakpointObserverService: BreakpointObserverService,
    private moderatorModalService: ModeratorModalService,
    private subCategoryService: SubCategoryService
  ) {}

  private readonly _categories$ = new BehaviorSubject<CategoryWithSubCategories[]>(
    this.activatedRoute.snapshot.data[RouteDataEnum.categories]
  );

  readonly categories$ = this._categories$.asObservable();
  readonly idCategories$ = this.categories$.pipe(
    map(categories => categories.map(category => `category-drop-list-${category.id}`))
  );
  readonly hasNoneDeleted$ = this.categories$.pipe(
    map(categories =>
      categories.every(
        category => !category.deletedDate && category.subCategories.every(subCategory => !subCategory.deletedDate)
      )
    )
  );
  readonly isAdmin$ = this.authQuery.isAdmin$;
  readonly isMobile$ = this.breakpointObserverService.isMobile$;
  readonly mdiAccountTie = mdiAccountTie;
  readonly trackById = trackById;

  loadingAddEditModal = false;
  loadingManageModeratorsModal = false;
  updatingOrder = false;
  hideDeleted = true;

  private _setCategories(
    categories: CategoryWithSubCategories[] | ((categories: CategoryWithSubCategories[]) => CategoryWithSubCategories[])
  ): void {
    const update = isFunction(categories) ? categories : () => categories;
    this._categories$.next(update(this._getCategories()));
  }

  private _getCategories(): CategoryWithSubCategories[] {
    return [...this._categories$.value];
  }

  async openAddEditModal(idCategory?: number): Promise<void> {
    this.loadingAddEditModal = true;
    const modalRef = await this.categoryModalService.openAddEdit(idCategory);
    modalRef.onClose$.subscribe(category => {
      if (!category) {
        return;
      }
      this._setCategories(categories =>
        arrayUtil(categories)
          .upsert(category.id, _category => ({
            ..._category,
            ...category,
            subCategories: _category?.subCategories ?? [],
          }))
          .orderBy('order')
          .toArray()
      );
      this.changeDetectorRef.markForCheck();
    });
    this.loadingAddEditModal = false;
    this.changeDetectorRef.markForCheck();
  }

  onCdkDropListDropped(
    $event: CdkDragDrop<CategoryWithSubCategories[], CategoryWithSubCategories[], CategoryWithSubCategories>
  ): void {
    if ($event.previousIndex === $event.currentIndex) {
      return;
    }
    this.updatingOrder = true;
    this._setCategories(categories => arrayUtil(categories).move($event.previousIndex, $event.currentIndex).toArray());
    this.categoryService
      .updateOrder(this._getCategories().map(category => category.id))
      .pipe(
        finalize(() => {
          this.updatingOrder = false;
          this.changeDetectorRef.markForCheck();
        })
      )
      .subscribe(orderedCategories => {
        this._setCategories(categories => arrayUtil(categories).upsert(orderedCategories).orderBy('order').toArray());
      });
  }

  onCategoryChange($event: CategoryWithSubCategories): void {
    this._setCategories(categories => arrayUtil(categories).update($event.id, $event).toArray());
  }

  async openManageModerators(): Promise<void> {
    this.loadingManageModeratorsModal = true;
    await this.moderatorModalService.management();
    this.loadingManageModeratorsModal = false;
    this.changeDetectorRef.markForCheck();
  }

  onSubCategoryOrderChange({ idCategory, cdkDragDrop }: ForumCategoriesCategoryComponentOrderChangeEvent): void {
    let subCategoryOrderDtos: SubCategoryOrderDto[];
    let categories = this._getCategories();
    if (cdkDragDrop.previousContainer !== cdkDragDrop.container) {
      let fromCategory: CategoryWithSubCategories | undefined;
      let toCategory: CategoryWithSubCategories | undefined;
      for (const category of categories) {
        if (category.id === cdkDragDrop.item.data.idCategory) {
          fromCategory = category;
        } else if (category.id === idCategory) {
          toCategory = category;
        }
      }
      if (!fromCategory || !toCategory) {
        return;
      }
      fromCategory = {
        ...fromCategory,
        subCategories: arrayUtil(fromCategory.subCategories)
          .remove(cdkDragDrop.item.data.id)
          .map((subCategory, index) => ({ ...subCategory, order: index + 1 }))
          .orderBy('order')
          .toArray(),
      };
      toCategory = {
        ...toCategory,
        subCategories: arrayUtil(toCategory.subCategories)
          .insert({ ...cdkDragDrop.item.data, idCategory: toCategory.id }, cdkDragDrop.currentIndex)
          .map((subCategory, index) => ({ ...subCategory, order: index + 1 }))
          .orderBy('order')
          .toArray(),
      };
      categories = arrayUtil(categories)
        .update(fromCategory.id, fromCategory)
        .update(toCategory.id, toCategory)
        .toArray();
      subCategoryOrderDtos = [...fromCategory.subCategories, ...toCategory.subCategories].map(subCategory => ({
        idCategory: cdkDragDrop.item.data.id === subCategory.id ? subCategory.idCategory : undefined,
        order: subCategory.order,
        id: subCategory.id,
      }));
    } else {
      categories = arrayUtil(categories)
        .update(idCategory, category => ({
          ...category,
          subCategories: arrayUtil(category.subCategories)
            .move(cdkDragDrop.previousIndex, cdkDragDrop.currentIndex)
            .toArray(),
        }))
        .toArray();
      const category = arrayUtil(categories).getOneOrFail(cdkDragDrop.item.data.idCategory);
      subCategoryOrderDtos = category.subCategories.map((subCategory, index) => ({
        id: subCategory.id,
        order: index + 1,
      }));
    }
    this._setCategories(categories);
    this.subCategoryService.updateOrder(subCategoryOrderDtos).subscribe();
  }
}
