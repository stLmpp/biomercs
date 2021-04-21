import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ComponentRef,
  HostBinding,
  Input,
  OnChanges,
  ViewChild,
  ViewContainerRef,
  ViewEncapsulation,
} from '@angular/core';
import { ColDefInternal } from '@shared/components/table/col-def';
import { CdkPortalOutlet, ComponentPortal } from '@angular/cdk/portal';
import { BioCellComponent } from '@shared/components/table/type';
import { SimpleChangesCustom } from '@util/util';

@Component({
  selector: 'bio-cell',
  templateUrl: './cell.component.html',
  styleUrls: ['./cell.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: { class: 'bio-cell' },
})
export class CellComponent<T extends Record<any, any>, K extends keyof T> implements AfterViewInit, OnChanges {
  constructor(private viewContainerRef: ViewContainerRef) {}

  private _viewInitialized = false;
  private _componentPortal!: ComponentPortal<BioCellComponent<T, K>>;
  private _componentRef!: ComponentRef<BioCellComponent<T, K>>;

  @ViewChild(CdkPortalOutlet) cdkPortalOutlet!: CdkPortalOutlet;

  @Input() colDef!: ColDefInternal<T, K>;
  @Input() item!: T;

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
    if (this.colDef.component) {
      this._componentPortal = new ComponentPortal(this.colDef.component, this.viewContainerRef);
      this._componentRef = this.cdkPortalOutlet.attachComponentPortal(this._componentPortal);
      this._componentRef.instance.colDef = this.colDef;
      this._componentRef.instance.item = this.item;
      this._componentRef.changeDetectorRef.markForCheck();
    }
  }

  ngAfterViewInit(): void {
    this._viewInitialized = true;
    this._createComponentPortal();
  }

  ngOnChanges(changes: SimpleChangesCustom<CellComponent<T, K>>): void {
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
      if (itemChanges || colDefChanges) {
        this._componentRef.changeDetectorRef.markForCheck();
      }
    }
  }
}
