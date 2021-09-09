import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CategoryWithSubCategories } from '@model/forum/category';
import { RouteDataEnum } from '@model/enum/route-data.enum';
import { trackById } from '@util/track-by';
import { AuthQuery } from '../../auth/auth.query';
import { CategoryModalService } from '../service/category-modal.service';
import { arrayUtil } from 'st-utils';
import { CdkDragDrop } from '@angular/cdk/drag-drop/drag-events';
import { CategoryService } from '../service/category.service';
import { finalize } from 'rxjs';
import { BreakpointObserverService } from '@shared/services/breakpoint-observer/breakpoint-observer.service';
import { mdiAccountTie } from '@mdi/js';
import { ModeratorModalService } from '../service/moderator-modal.service';

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
    private moderatorModalService: ModeratorModalService
  ) {}

  categories: CategoryWithSubCategories[] = this.activatedRoute.snapshot.data[RouteDataEnum.categories];
  readonly isAdmin$ = this.authQuery.isAdmin$;
  readonly isMobile$ = this.breakpointObserverService.isMobile$;
  readonly mdiAccountTie = mdiAccountTie;
  readonly trackById = trackById;

  loadingAddEditModal = false;
  loadingManageModeratorsModal = false;
  updatingOrder = false;
  hideDeleted = true;

  async openAddEditModal(idCategory?: number): Promise<void> {
    this.loadingAddEditModal = true;
    const modalRef = await this.categoryModalService.openAddEdit(idCategory);
    modalRef.onClose$.subscribe(category => {
      if (!category) {
        return;
      }
      this.categories = arrayUtil(this.categories)
        .upsert(category.id, _category => ({
          ..._category,
          ...category,
          subCategories: _category?.subCategories ?? [],
        }))
        .orderBy('order')
        .toArray();
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
    this.categories = arrayUtil(this.categories).move($event.previousIndex, $event.currentIndex).toArray();
    this.categoryService
      .updateOrder(this.categories.map(category => category.id))
      .pipe(
        finalize(() => {
          this.updatingOrder = false;
          this.changeDetectorRef.markForCheck();
        })
      )
      .subscribe(categories => {
        this.categories = arrayUtil(this.categories).upsert(categories).orderBy('order').toArray();
      });
  }

  onCategoryChange($event: CategoryWithSubCategories): void {
    this.categories = arrayUtil(this.categories).update($event.id, $event).toArray();
  }

  async openManageModerators(): Promise<void> {
    this.loadingManageModeratorsModal = true;
    await this.moderatorModalService.management();
    this.loadingManageModeratorsModal = false;
    this.changeDetectorRef.markForCheck();
  }
}
