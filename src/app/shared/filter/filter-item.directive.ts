import { ChangeDetectorRef, Directive, ElementRef, HostBinding, Input, inject, input } from '@angular/core';
import { BioFilterBy } from '@shared/filter/filter';

@Directive({
  selector: '[bioFilterItem]',
  host: { class: 'bio-filter-item' },
})
export class FilterItemDirective {
  private changeDetectorRef = inject(ChangeDetectorRef);
  private elementRef = inject<ElementRef<HTMLElement>>(ElementRef);


  private _bioFilterItem: BioFilterBy = 'textContent';

  @Input()
  get bioFilterItem(): BioFilterBy {
    return this._bioFilterItem;
  }
  set bioFilterItem(bioFilterBy: BioFilterBy) {
    if (bioFilterBy) {
      this._bioFilterItem = bioFilterBy;
    }
  }

  readonly id = input<string | number>();
  readonly bioFilterItemFn = input<(filterItemDirective: FilterItemDirective) => string>();

  @HostBinding('class.bio-filter-item-hidden') hidden = false;

  setHidden(hidden: boolean): void {
    this.hidden = hidden;
    this.changeDetectorRef.markForCheck();
  }

  getFilterText(): string {
    let label: string | null | undefined;
    const id = this.id();
    switch (this._bioFilterItem) {
      case 'function':
        label = this.bioFilterItemFn()?.(this);
        break;
      case 'id':
        label = id ? '' + id : null;
        break;
      case 'innerText':
        label = this.elementRef.nativeElement.innerText;
        break;
      default:
        label = this.elementRef.nativeElement.textContent;
        break;
    }
    return label ?? '';
  }

  static ngAcceptInputType_bioFilterItem: BioFilterBy | '' | null | undefined;
}
