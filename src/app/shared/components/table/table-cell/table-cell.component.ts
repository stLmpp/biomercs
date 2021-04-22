import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ComponentRef,
  EventEmitter,
  HostBinding,
  Input,
  OnChanges,
  Output,
  ViewChild,
  ViewContainerRef,
  ViewEncapsulation,
} from '@angular/core';
import { ColDefInternal } from '@shared/components/table/col-def';
import { CdkPortalOutlet, ComponentPortal } from '@angular/cdk/portal';
import { TableCell, TableCellNotifyChange } from '@shared/components/table/type';
import { SimpleChangesCustom } from '@util/util';
import { Destroyable } from '@shared/components/common/destroyable-component';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'bio-cell',
  templateUrl: './table-cell.component.html',
  styleUrls: ['./table-cell.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: { class: 'bio-cell' },
})
export class TableCellComponent<T extends Record<any, any>, K extends keyof T>
  extends Destroyable
  implements AfterViewInit, OnChanges {
  constructor(private viewContainerRef: ViewContainerRef) {
    super();
  }

  private _viewInitialized = false;
  private _componentPortal!: ComponentPortal<TableCell<T, K>>;
  private _componentRef!: ComponentRef<TableCell<T, K>>;

  @ViewChild(CdkPortalOutlet) cdkPortalOutlet!: CdkPortalOutlet;

  @Input() colDef!: ColDefInternal<T, K>;
  @Input() item!: T;
  @Input() metadata: any;

  @Output() readonly notifyChange = new EventEmitter<TableCellNotifyChange<any, T, K>>();

  @HostBinding('class.flex-grow-0')
  get classFlexGrow0(): boolean {
    return !!this.colDef.width;
  }

  @HostBinding('style.flex-basis')
  get styleFlexBasis(): string | undefined {
    return this.colDef.width;
  }

  private _createComponentPortal(): void {
    if (!this._viewInitialized) {
      return;
    }
    if (this.cdkPortalOutlet.hasAttached()) {
      this.cdkPortalOutlet.detach();
    }
    this.destroy$.next();
    if (this.colDef.component) {
      this._componentPortal = new ComponentPortal(this.colDef.component, this.viewContainerRef);
      this._componentRef = this.cdkPortalOutlet.attachComponentPortal(this._componentPortal);
      this._componentRef.instance.colDef = this.colDef;
      this._componentRef.instance.item = this.item;
      this._componentRef.instance.metadata = this.metadata;
      this._componentRef.changeDetectorRef.detectChanges();
      this._componentRef.instance.notifyChange.pipe(takeUntil(this.destroy$)).subscribe(data => {
        this.notifyChange.emit({ data, colDef: this.colDef, item: this.item });
      });
    }
  }

  ngAfterViewInit(): void {
    this._viewInitialized = true;
    this._createComponentPortal();
  }

  ngOnChanges(changes: SimpleChangesCustom<TableCellComponent<T, K>>): void {
    const colDefChanges = changes.colDef;
    if (colDefChanges) {
      if (colDefChanges.currentValue.component !== colDefChanges.currentValue.component) {
        this._createComponentPortal();
      } else if (this._componentRef) {
        this._componentRef.instance.colDef = colDefChanges.currentValue;
      }
    }
    if (this._componentRef) {
      const itemChanges = changes.item;
      if (itemChanges) {
        this._componentRef.instance.item = itemChanges.currentValue;
      }
      const metadataChanges = changes.metadata;
      if (metadataChanges) {
        this._componentRef.instance.metadata = changes.metadata;
      }
      if (itemChanges || colDefChanges || metadataChanges) {
        this._componentRef.changeDetectorRef.markForCheck();
      }
    }
  }
}
