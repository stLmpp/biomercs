import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { SubCategoryWithTopics } from '@model/forum/sub-category';
import { ActivatedRoute, Router } from '@angular/router';
import { RouteDataEnum } from '@model/enum/route-data.enum';
import { trackByIndex } from '@util/track-by';
import { RouteParamEnum } from '@model/enum/route-param.enum';
import { SubCategoryService } from '../service/sub-category.service';
import { finalize, skip, takeUntil } from 'rxjs';
import { Destroyable } from '@shared/components/common/destroyable-component';
import { Topic } from '@model/forum/topic';
import { arrayUtil } from 'st-utils';

@Component({
  selector: 'bio-forum-sub-category',
  templateUrl: './forum-sub-category.component.html',
  styleUrls: ['./forum-sub-category.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ForumSubCategoryComponent extends Destroyable implements OnInit {
  constructor(
    private activatedRoute: ActivatedRoute,
    private changeDetectorRef: ChangeDetectorRef,
    private subCategoryService: SubCategoryService,
    private router: Router
  ) {
    super();
  }

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
