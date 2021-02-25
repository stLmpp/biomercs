import { animate, AnimationTriggerMetadata, state, style, transition, trigger } from '@angular/animations';

export class CollapseAnimations {
  static collapse(ms = 400, type = 'cubic-bezier(0.4,0.0,0.2,1)'): AnimationTriggerMetadata {
    return trigger('collapse', [
      transition(':leave', [style({ overflow: 'hidden' }), animate(`${ms}ms ${type}`, style({ height: '0px' }))]),
      transition(':enter', [
        style({ height: 0, overflow: 'hidden' }),
        animate(`${ms}ms ${type}`, style({ height: '*' })),
      ]),
    ]);
  }
  static collapseIcon(ms = 200): AnimationTriggerMetadata {
    return trigger('collapseIcon', [
      state('collapsed', style({ transform: 'rotate(180deg)' })),
      state('expanded', style({ transform: 'rotate(0deg)' })),
      transition('collapsed <=> expanded', animate(ms)),
    ]);
  }
}
