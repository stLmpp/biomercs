import {
  AfterViewInit,
  ComponentFactoryResolver,
  Directive,
  ElementRef,
  Injector,
  Input,
  OnDestroy,
  OnInit,
  Renderer2,
  ViewContainerRef,
} from '@angular/core';
import { LoadingComponent } from './loading.component';
import { BooleanInput, coerceBooleanProperty } from 'st-utils';

@Directive({
  selector: '[bioLoading]',
  host: { '[style.position]': `'relative'`, '[style.min-height]': `'150px'` },
})
export class LoadingDirective implements OnInit, AfterViewInit, OnDestroy {
  constructor(
    private viewContainerRef: ViewContainerRef,
    private componentFactoryResolver: ComponentFactoryResolver,
    private injector: Injector,
    private renderer2: Renderer2,
    private elementRef: ElementRef
  ) {}

  private readonly _componentFactory = this.componentFactoryResolver.resolveComponentFactory(LoadingComponent);
  private readonly _componentRef = this.viewContainerRef.createComponent(this._componentFactory);

  private _loading = false;
  private _noBox = false;

  @Input()
  get bioLoading(): boolean {
    return this._loading;
  }
  set bioLoading(loading: boolean) {
    this._loading = coerceBooleanProperty(loading);
    this.toggle(this._loading);
  }

  @Input()
  get noBox(): boolean {
    return this._noBox;
  }
  set noBox(noBox: boolean) {
    this._noBox = coerceBooleanProperty(noBox);
    this._componentRef.instance.noBox = noBox;
    this._componentRef.changeDetectorRef.markForCheck();
  }

  toggle(loading: boolean): void {
    if (loading) {
      this.show();
    } else {
      this.hide();
    }
  }

  show(): void {
    this.renderer2.appendChild(this.elementRef.nativeElement, this._componentRef.location.nativeElement);
  }

  hide(): void {
    this.renderer2.removeChild(this.elementRef.nativeElement, this._componentRef.location.nativeElement);
  }

  ngOnInit(): void {
    this._componentRef.instance.noBox = this._noBox;
    this._componentRef.changeDetectorRef.markForCheck();
  }

  ngAfterViewInit(): void {
    this.toggle(this._loading);
  }

  ngOnDestroy(): void {
    this._componentRef.destroy();
  }

  static ngAcceptInputType_bioLoading: BooleanInput;
  static ngAcceptInputType_noBox: BooleanInput;
}
