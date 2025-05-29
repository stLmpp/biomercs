import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CategoriesWithRecentTopics, CategoryWithSubCategories } from '@model/forum/category';
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
import {
  ForumCategoriesCategoryComponentOrderChangeEvent,
  ForumCategoriesCategoryComponent,
} from './forum-categories-category/forum-categories-category.component';
import { SubCategoryService } from '../service/sub-category.service';
import { TopicRecent } from '@model/forum/topic';
import { NgLetModule } from '@stlmpp/utils';
import { CheckboxComponent } from '../../shared/components/checkbox/checkbox.component';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { IconMdiComponent } from '../../shared/components/icon/icon-mdi.component';
import { IconComponent } from '../../shared/components/icon/icon.component';
import { AccordionDirective } from '../../shared/components/accordion/accordion.directive';
import { CdkDropList, CdkDrag, CdkDragHandle } from '@angular/cdk/drag-drop';
import { AccordionItemComponent } from '../../shared/components/accordion/accordion-item.component';
import { AccordionItemTitleDirective } from '../../shared/components/accordion/accordion-item-title.directive';
import { ForumCategoriesRecentTopicsComponent } from './forum-categories-recent-topics/forum-categories-recent-topics.component';
import { ForumCategoriesPlayersOnlineComponent } from './forum-categories-players-online/forum-categories-players-online.component';
import { AsyncPipe } from '@angular/common';
import { AuthDateFormatPipe } from '../../auth/shared/auth-date-format.pipe';
import { AsyncDefaultPipe } from '../../shared/async-default/async-default.pipe';
import { ForumFilterDeletedPipe } from './forum-filter-deleted.pipe';

@Component({
  selector: 'bio-forum-categories',
  templateUrl: './forum-categories.component.html',
  styleUrls: ['./forum-categories.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    NgLetModule,
    CheckboxComponent,
    ButtonComponent,
    IconMdiComponent,
    IconComponent,
    AccordionDirective,
    CdkDropList,
    AccordionItemComponent,
    CdkDrag,
    AccordionItemTitleDirective,
    CdkDragHandle,
    ForumCategoriesCategoryComponent,
    ForumCategoriesRecentTopicsComponent,
    ForumCategoriesPlayersOnlineComponent,
    AsyncPipe,
    AuthDateFormatPipe,
    AsyncDefaultPipe,
    ForumFilterDeletedPipe,
  ],
})
export class ForumCategoriesComponent {
  private activatedRoute = inject(ActivatedRoute);
  private authQuery = inject(AuthQuery);
  private categoryModalService = inject(CategoryModalService);
  private changeDetectorRef = inject(ChangeDetectorRef);
  private categoryService = inject(CategoryService);
  private breakpointObserverService = inject(BreakpointObserverService);
  private moderatorModalService = inject(ModeratorModalService);
  private subCategoryService = inject(SubCategoryService);

  private readonly _categories$ = new BehaviorSubject<CategoryWithSubCategories[]>(
    this._getCategoriesWithRecentTopicsFromRoute().categories
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

  readonly recentTopics: TopicRecent[] = this._getCategoriesWithRecentTopicsFromRoute().recentTopics;

  loadingAddEditModal = false;
  loadingManageModeratorsModal = false;
  updatingOrder = false;
  hideDeleted = true;

  private _getCategoriesWithRecentTopicsFromRoute(): CategoriesWithRecentTopics {
    return this.activatedRoute.snapshot.data[RouteDataEnum.categoriesWithRecentTopics];
  }

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
