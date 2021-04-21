export function getFormattedKey<T extends Record<any, any>, K extends keyof T>(key: K): `${K & string}Formatted` {
  return `${key}Formatted` as `${K & string}Formatted`;
}
