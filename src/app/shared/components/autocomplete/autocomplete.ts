export abstract class Autocomplete {
  abstract isSelected(value: string): boolean;
  abstract select(value: string): void;
}
