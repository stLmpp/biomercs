import { Component, OnInit, ChangeDetectionStrategy, Inject, ChangeDetectorRef } from '@angular/core';
import { SubCategoryService } from '../service/sub-category.service';
import { MODAL_DATA } from '@shared/components/modal/modal.config';
import { SubCategory, SubCategoryUpdateDto } from '@model/forum/sub-category';
import { finalize } from 'rxjs';
import { Control, ControlGroup, Validators } from '@stlmpp/control';

export interface ForumSubCategoryAddEditComponentData {
  idSubCategory: number | undefined;
  idCategory: number;
}

@Component({
  selector: 'bio-forum-sub-category-add-edit',
  templateUrl: './forum-sub-category-add-edit.component.html',
  styleUrls: ['./forum-sub-category-add-edit.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ForumSubCategoryAddEditComponent implements OnInit {
  constructor(
    @Inject(MODAL_DATA) { idSubCategory, idCategory }: ForumSubCategoryAddEditComponentData,
    private subCategoryService: SubCategoryService,
    private changeDetectorRef: ChangeDetectorRef
  ) {
    this.idSubCategory = idSubCategory;
    this.idCategory = idCategory;
    this.subCategory = { id: -1, idCategory: this.idCategory, order: -1, name: '', description: '' };
    this.form = new ControlGroup<SubCategoryUpdateDto>({
      name: new Control('', [Validators.required, Validators.whiteSpace, Validators.maxLength(100)]),
      description: new Control('', [Validators.required, Validators.whiteSpace, Validators.maxLength(1000)]),
      idCategory: new Control(this.idCategory, [Validators.required]),
      deleted: new Control(false),
      restored: new Control(false),
    });
  }

  idSubCategory: number | undefined;
  idCategory: number;

  subCategory: SubCategory;
  loading = false;

  readonly form: ControlGroup<SubCategoryUpdateDto>;

  ngOnInit(): void {
    if (this.idSubCategory) {
      this.loading = true;
      this.subCategoryService
        .getById(this.idSubCategory)
        .pipe(
          finalize(() => {
            this.loading = false;
            this.changeDetectorRef.markForCheck();
          })
        )
        .subscribe(subCategory => {
          this.subCategory = subCategory;
          this.form.patchValue(subCategory);
        });
    }
  }
}
