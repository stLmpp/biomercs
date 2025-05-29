import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { SubCategoryWithTopics } from '@model/forum/sub-category';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { RouteDataEnum } from '@model/enum/route-data.enum';
import { trackByIndex } from '@util/track-by';
import { RouteParamEnum } from '@model/enum/route-param.enum';
import { SubCategoryService } from '../service/sub-category.service';
import { finalize, skip, takeUntil } from 'rxjs';
import { Destroyable } from '@shared/components/common/destroyable-component';
import { Topic } from '@model/forum/topic';
import { arrayUtil } from 'st-utils';
import { CardComponent } from '../../shared/components/card/card.component';
import { LoadingComponent } from '../../shared/components/spinner/loading/loading.component';
import { CardContentDirective } from '../../shared/components/card/card-content.directive';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { ForumSubCategoryTopicComponent } from './forum-sub-category-topic/forum-sub-category-topic.component';
import { CardActionsDirective } from '../../shared/components/card/card-actions.directive';
import { PaginationComponent } from '../../shared/components/pagination/pagination.component';

@Component({
  selector: 'bio-forum-sub-category',
  templateUrl: './forum-sub-category.component.html',
  styleUrls: ['./forum-sub-category.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CardComponent,
    LoadingComponent,
    CardContentDirective,
    ButtonComponent,
    RouterLink,
    ForumSubCategoryTopicComponent,
    CardActionsDirective,
    PaginationComponent,
  ],
})
export class ForumSubCategoryComponent extends Destroyable implements OnInit {
  private activatedRoute = inject(ActivatedRoute);
  private changeDetectorRef = inject(ChangeDetectorRef);
  private subCategoryService = inject(SubCategoryService);
  private router = inject(Router);


  page = +(this.activatedRoute.snapshot.paramMap.get(RouteParamEnum.pageSubCategory) ?? 1);
  loading = false;
  subCategory: SubCategoryWithTopics = this.activatedRoute.snapshot.data[RouteDataEnum.subCategoryWithTopics];

  readonly trackById = trackByIndex;

  async onPageChange($event: number): Promise<void> {
    this.loading = true;
    await this.router.navigate(['../', $event], { relativeTo: this.activatedRoute });
    this.loading = false;
    this.changeDetectorRef.markForCheck();
  }

  onTopicChange($event: Topic): void {
    this.subCategory = {
      ...this.subCategory,
      topics: {
        ...this.subCategory.topics,
        items: arrayUtil(this.subCategory.topics.items).update($event.id, $event).toArray(),
      },
    };
    this.changeDetectorRef.markForCheck();
  }

  onReloadSubcategory(): void {
    this.loading = true;
    const {
      id,
      topics: { meta },
    } = this.subCategory;
    this.subCategoryService
      .getByIdWithTopics(id, meta.currentPage, meta.itemsPerPage)
      .pipe(
        finalize(() => {
          this.loading = false;
          this.changeDetectorRef.markForCheck();
        })
      )
      .subscribe(subCategory => {
        this.subCategory = subCategory;
      });
  }

  ngOnInit(): void {
    this.activatedRoute.data.pipe(takeUntil(this.destroy$), skip(1)).subscribe(data => {
      const subCategory: SubCategoryWithTopics = data[RouteDataEnum.subCategoryWithTopics];
      if (subCategory) {
        this.subCategory = subCategory;
      }
      this.changeDetectorRef.markForCheck();
    });
  }
}
