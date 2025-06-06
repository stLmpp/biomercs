import {
  AfterViewInit,
  ComponentFactoryResolver,
  Directive,
  ElementRef,
  HostBinding,
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
  host: { '[style.position]': `'relative'` },
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
  private _bioLoadingNoBox = false;
  private _bioLoadingIgnoreMinHeight = false;

  @Input()
  get bioLoading(): boolean {
    return this._loading;
  }
  set bioLoading(loading: boolean) {
    this._loading = coerceBooleanProperty(loading);
    this.toggle(this._loading);
  }

  @Input()
  get bioLoadingNoBox(): boolean {
    return this._bioLoadingNoBox;
  }
  set bioLoadingNoBox(noBox: boolean) {
    this._bioLoadingNoBox = coerceBooleanProperty(noBox);
    this._componentRef.instance.noBox = noBox;
    this._componentRef.changeDetectorRef.markForCheck();
  }

  @Input()
  get bioLoadingIgnoreMinHeight(): boolean {
    return this._bioLoadingIgnoreMinHeight;
  }
  set bioLoadingIgnoreMinHeight(bioLoadingIgnoreMinHeight: boolean) {
    this._bioLoadingIgnoreMinHeight = coerceBooleanProperty(bioLoadingIgnoreMinHeight);
  }

  @HostBinding('style.min-height.px')
  get styleMinHeight(): number {
    return this._bioLoadingIgnoreMinHeight ? 0 : 150;
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
    this._componentRef.instance.noBox = this._bioLoadingNoBox;
    this._componentRef.changeDetectorRef.markForCheck();
  }

  ngAfterViewInit(): void {
    this.toggle(this._loading);
  }

  ngOnDestroy(): void {
    this._componentRef.destroy();
  }

  static ngAcceptInputType_bioLoading: BooleanInput;
  static ngAcceptInputType_bioLoadingNoBox: BooleanInput;
  static ngAcceptInputType_bioLoadingIgnoreMinHeight: BooleanInput;
}
