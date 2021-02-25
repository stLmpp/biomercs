import { Observable } from 'rxjs';
import { Region } from '@model/region';

export abstract class AbstractRegionService {
  abstract get(): Observable<Region[]>;
}
