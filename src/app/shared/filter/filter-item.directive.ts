import { ChangeDetectorRef, Directive, ElementRef, HostBinding, Input, inject } from '@angular/core';
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

  @Input() id?: string | number;
  @Input() bioFilterItemFn?: (filterItemDirective: FilterItemDirective) => string;

  @HostBinding('class.bio-filter-item-hidden') hidden = false;

  setHidden(hidden: boolean): void {
    this.hidden = hidden;
    this.changeDetectorRef.markForCheck();
  }

  getFilterText(): string {
    let label: string | null | undefined;
    switch (this._bioFilterItem) {
      case 'function':
        label = this.bioFilterItemFn?.(this);
        break;
      case 'id':
        label = this.id ? '' + this.id : null;
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
