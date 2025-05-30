import { NgxMaskConfig } from 'ngx-mask';

export enum MaskEnum {
  time = '99\'59"99',
}

export const MaskEnumPatterns: { [K in MaskEnum]?: NgxMaskConfig['patterns'] } = {
  [MaskEnum.time]: { [5]: { symbol: '5', pattern: /[0-5]/ }, [9]: { symbol: '5', pattern: /[0-9]/ } },
};
