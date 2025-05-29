import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { SubCategoryService } from '../service/sub-category.service';
import { MODAL_DATA } from '@shared/components/modal/modal.config';
import { SubCategory, SubCategoryAddDto, SubCategoryUpdateDto } from '@model/forum/sub-category';
import { finalize, map, Observable } from 'rxjs';
import {
  Control,
  ControlGroup,
  Validators,
  StControlModule,
  StControlCommonModule,
  StControlValueModule,
} from '@stlmpp/control';
import { ModalRef } from '@shared/components/modal/modal-ref';
import { LoadingComponent } from '../../shared/components/spinner/loading/loading.component';
import { ModalTitleDirective } from '../../shared/components/modal/modal-title.directive';
import { ModalContentDirective } from '../../shared/components/modal/modal-content.directive';
import { FormFieldComponent } from '../../shared/components/form/form-field.component';
import { InputDirective } from '../../shared/components/form/input.directive';
import { FormFieldHintDirective } from '../../shared/components/form/hint.directive';
import { FormFieldErrorsDirective } from '../../shared/components/form/errors.directive';
import { FormFieldErrorComponent } from '../../shared/components/form/error.component';
import { TextareaDirective } from '../../shared/components/form/textarea.directive';
import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { CheckboxComponent } from '../../shared/components/checkbox/checkbox.component';
import { ModalActionsDirective } from '../../shared/components/modal/modal-actions.directive';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { ModalCloseDirective } from '../../shared/components/modal/modal-close.directive';
import { AsyncPipe } from '@angular/common';

export interface ForumSubCategoryAddEditComponentData {
  idSubCategory: number | undefined;
  idCategory: number;
}

@Component({
  selector: 'bio-forum-sub-category-add-edit',
  templateUrl: './forum-sub-category-add-edit.component.html',
  styleUrls: ['./forum-sub-category-add-edit.component.scss'],
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
    TextareaDirective,
    CdkTextareaAutosize,
    CheckboxComponent,
    ModalActionsDirective,
    ButtonComponent,
    ModalCloseDirective,
    AsyncPipe,
  ],
})
export class ForumSubCategoryAddEditComponent implements OnInit {
  private subCategoryService = inject(SubCategoryService);
  private changeDetectorRef = inject(ChangeDetectorRef);
  private modalRef = inject<ModalRef<ForumSubCategoryAddEditComponent, ForumSubCategoryAddEditComponentData, SubCategory>>(ModalRef);

  constructor() {
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
    this.nameHint$ = this.form.get('name').value$.pipe(map(name => `${(name ?? '').length} / 100`));
    this.descriptionHint$ = this.form
      .get('description')
      .value$.pipe(map(description => `${(description ?? '').length} / 1000`));
  }

  idSubCategory: number | undefined;
  idCategory: number;

  subCategory: SubCategory;
  loading = false;
  saving = false;

  readonly form: ControlGroup<SubCategoryUpdateDto>;

  nameHint$: Observable<string>;
  descriptionHint$: Observable<string>;

  save(): void {
    if (this.form.invalid) {
      return;
    }
    this.saving = true;
    this.form.disable();
    const formValue = this.form.value;
    this.modalRef.disableClose = true;
    let http$: Observable<SubCategory>;
    if (this.idSubCategory) {
      http$ = this.subCategoryService.update(this.idSubCategory, formValue);
    } else {
      http$ = this.subCategoryService.add(formValue as SubCategoryAddDto);
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
      .subscribe(subCategory => {
        this.modalRef.close(subCategory);
      });
  }

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
