import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { MODAL_DATA } from '@shared/components/modal/modal.config';
import { CategoryService } from '../service/category.service';
import { Category, CategoryUpdateDto } from '@model/forum/category';
import {
  Control,
  ControlGroup,
  Validators,
  StControlModule,
  StControlCommonModule,
  StControlValueModule,
} from '@stlmpp/control';
import { finalize, map, Observable } from 'rxjs';
import { ModalRef } from '@shared/components/modal/modal-ref';
import { LoadingComponent } from '../../shared/components/spinner/loading/loading.component';
import { ModalTitleDirective } from '../../shared/components/modal/modal-title.directive';
import { ModalContentDirective } from '../../shared/components/modal/modal-content.directive';
import { FormFieldComponent } from '../../shared/components/form/form-field.component';
import { InputDirective } from '../../shared/components/form/input.directive';
import { FormFieldHintDirective } from '../../shared/components/form/hint.directive';
import { FormFieldErrorsDirective } from '../../shared/components/form/errors.directive';
import { FormFieldErrorComponent } from '../../shared/components/form/error.component';
import { CheckboxComponent } from '../../shared/components/checkbox/checkbox.component';
import { ModalActionsDirective } from '../../shared/components/modal/modal-actions.directive';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { ModalCloseDirective } from '../../shared/components/modal/modal-close.directive';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'bio-forum-category-add-edit',
  templateUrl: './forum-category-add-edit.component.html',
  styleUrls: ['./forum-category-add-edit.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    LoadingComponent,
    StControlModule,
    StControlCommonModule,
    ModalTitleDirective,
    ModalContentDirective,
    FormFieldComponent,
    InputDirective,
    StControlValueModule,
    FormFieldHintDirective,
    FormFieldErrorsDirective,
    FormFieldErrorComponent,
    CheckboxComponent,
    ModalActionsDirective,
    ButtonComponent,
    ModalCloseDirective,
    AsyncPipe,
  ],
})
export class ForumCategoryAddEditComponent implements OnInit {
  idCategory = inject(MODAL_DATA);
  private categoryService = inject(CategoryService);
  private changeDetectorRef = inject(ChangeDetectorRef);
  private modalRef = inject<ModalRef<ForumCategoryAddEditComponent, number | undefined, Category>>(ModalRef);

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
