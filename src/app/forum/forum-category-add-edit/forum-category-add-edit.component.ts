import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { MODAL_DATA } from '@shared/components/modal/modal.config';
import { CategoryService } from '../service/category.service';
import { Category, CategoryUpdateDto } from '@model/forum/category';
import { Control, ControlGroup, Validators } from '@stlmpp/control';
import { finalize, map, Observable } from 'rxjs';
import { ModalRef } from '@shared/components/modal/modal-ref';

@Component({
  selector: 'bio-forum-category-add-edit',
  templateUrl: './forum-category-add-edit.component.html',
  styleUrls: ['./forum-category-add-edit.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ForumCategoryAddEditComponent implements OnInit {
  constructor(
    @Inject(MODAL_DATA) public idCategory: number | undefined,
    private categoryService: CategoryService,
    private changeDetectorRef: ChangeDetectorRef,
    private modalRef: ModalRef<ForumCategoryAddEditComponent, number | undefined, Category>
  ) {}

  loading = false;
  saving = false;
  category: Category = { id: -1, name: '', order: -1 };
  form = new ControlGroup<CategoryUpdateDto>({
    name: new Control('', [Validators.required, Validators.whiteSpace, Validators.maxLength(100)]),
    deleted: new Control(false),
    restored: new Control(false),
  });
  nameHint$ = this.form.get('name').value$.pipe(map(name => `${(name ?? '').length} / 100`));

  save(): void {
    if (this.form.invalid) {
      return;
    }
    this.saving = true;
    this.form.disable();
    const formValue = this.form.value;
    this.modalRef.disableClose = true;
    let http$: Observable<Category>;
    if (this.idCategory) {
      http$ = this.categoryService.update(this.idCategory, formValue);
    } else {
      http$ = this.categoryService.add({ name: formValue.name! });
    }
    http$
      .pipe(
        finalize(() => {
          this.saving = false;
          this.modalRef.disableClose = false;
          this.form.enable();
          this.changeDetectorRef.markForCheck();
        })
      )
      .subscribe(category => {
        this.modalRef.close(category);
      });
  }

  ngOnInit(): void {
    if (this.idCategory) {
      this.loading = true;
      this.categoryService
        .getById(this.idCategory)
        .pipe(
          finalize(() => {
            this.loading = false;
            this.changeDetectorRef.markForCheck();
          })
        )
        .subscribe(category => {
          this.category = category;
          this.form.patchValue(category);
        });
    }
  }
}
