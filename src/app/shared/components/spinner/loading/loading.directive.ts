import {
  AfterViewInit,
  ComponentFactory,
  ComponentFactoryResolver,
  ComponentRef,
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
import { BooleanInput, coerceBooleanProperty } from '@angular/cdk/coercion';

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

  @Input()
  get bioLoading(): boolean {
    return this._loading;
  }
  set bioLoading(loading: boolean) {
    this._loading = coerceBooleanProperty(loading);
    this.toggle(this._loading);
  }
  private _loading = false;

  @Input()
  get noBox(): boolean {
    return this._noBox;
  }
  set noBox(noBox: boolean) {
    this._noBox = coerceBooleanProperty(noBox);
    if (this.componentRef) {
      this.componentRef.instance.noBox = noBox;
      this.componentRef.changeDetectorRef.markForCheck();
    }
  }
  private _noBox = false;

  componentFactory?: ComponentFactory<LoadingComponent>;
  componentRef?: ComponentRef<LoadingComponent>;

  toggle(loading: boolean): void {
    if (loading) {
      this.show();
    } else {
      this.hide();
    }
  }

  show(): void {
    if (this.componentRef) {
      this.renderer2.appendChild(this.elementRef.nativeElement, this.componentRef.location.nativeElement);
    }
  }

  hide(): void {
    if (this.componentRef) {
      this.renderer2.removeChild(this.elementRef.nativeElement, this.componentRef.location.nativeElement);
    }
  }

  ngOnInit(): void {
    this.componentFactory = this.componentFactoryResolver.resolveComponentFactory(LoadingComponent);
    this.componentRef = this.viewContainerRef.createComponent(this.componentFactory);
    this.componentRef.instance.noBox = this._noBox;
    this.componentRef.changeDetectorRef.markForCheck();
  }

  ngAfterViewInit(): void {
    this.toggle(this._loading);
  }

  ngOnDestroy(): void {
    this.componentRef?.destroy();
  }

  static ngAcceptInputType_bioLoading: BooleanInput;
  static ngAcceptInputType_noBox: BooleanInput;
}
