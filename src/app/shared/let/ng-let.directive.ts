import { Directive, Input, OnDestroy, OnInit, TemplateRef, ViewContainerRef } from '@angular/core';

class NgLetContext<T> {
  $implicit!: T;
  ngLet!: T;

  setData(value: T): void {
    this.$implicit = value;
    this.ngLet = value;
  }
}

@Directive({ selector: '[ngLet]' })
export class NgLetDirective<T> implements OnDestroy, OnInit {
  constructor(private viewContainer: ViewContainerRef, private templateRef: TemplateRef<NgLetContext<T>>) {}

  private _context = new NgLetContext<T>();

  @Input()
  set ngLet(value: T) {
    this._context.setData(value);
  }

  ngOnInit(): void {
    this.viewContainer.clear();
    this.viewContainer.createEmbeddedView(this.templateRef, this._context);
  }

  ngOnDestroy(): void {
    this.viewContainer.clear();
  }

  static ngTemplateContextGuard<ST>(dir: NgLetDirective<ST>, ctx: any): ctx is NgLetContext<NonNullable<ST>> {
    return true;
  }
}
