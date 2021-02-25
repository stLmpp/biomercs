import {
  animate,
  AnimationTransitionMetadata,
  AnimationTriggerMetadata,
  style,
  transition,
  trigger,
} from '@angular/animations';

export class SlideAnimations {
  static inTransition(ms = 200): AnimationTransitionMetadata {
    return transition(':enter', [
      style({ transform: 'translateY(-100%)', opacity: 0 }),
      animate(ms, style({ transform: 'translate(0%)', opacity: 1 })),
    ]);
  }
  static outTransition(ms = 200): AnimationTransitionMetadata {
    return transition(':leave', [animate(ms, style({ transform: 'translateY(-100%)', opacity: 0 }))]);
  }
  static inOut(ms = 200): AnimationTriggerMetadata {
    return trigger('slideInOut', [SlideAnimations.inTransition(ms), SlideAnimations.outTransition(ms)]);
  }
  static in(ms = 200): AnimationTriggerMetadata {
    return trigger('slideIn', [SlideAnimations.inTransition(ms)]);
  }
  static out(ms = 200): AnimationTriggerMetadata {
    return trigger('slideOut', [SlideAnimations.outTransition(ms)]);
  }
}
