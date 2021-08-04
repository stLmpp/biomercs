import { map, OperatorFunction } from 'rxjs';
import { ParamMap } from '@angular/router';

export function mapToParam(param: string): OperatorFunction<ParamMap, string | undefined | null> {
  return map<ParamMap, string | null | undefined>(paramMap => paramMap.get(param));
}
