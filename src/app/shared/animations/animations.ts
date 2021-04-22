import { SlideAnimations } from './slide';
import { CollapseAnimations } from './collapse';
import { FadeAnimations } from './fade';
import { ScaleAnimations } from './scale';
import { AnimationTriggerMetadata, transition, trigger } from '@angular/animations';

export class Animations {
  static slide = SlideAnimations;
  static collapse = CollapseAnimations;
  static fade = FadeAnimations;
  static scale = ScaleAnimations;
  static skipFirstAnimation = (): AnimationTriggerMetadata => trigger('skipFirstAnimation', [transition(':enter', [])]);
}
