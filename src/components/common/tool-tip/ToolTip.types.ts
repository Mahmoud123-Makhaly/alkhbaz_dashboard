type BasePlacement = 'top' | 'bottom' | 'right' | 'left';
type AutoPlacement = 'auto' | 'auto-start' | 'auto-end';
type VariationPlacement =
  | 'top-start'
  | 'top-end'
  | 'bottom-start'
  | 'bottom-end'
  | 'right-start'
  | 'right-end'
  | 'left-start'
  | 'left-end';
export type Placement = AutoPlacement | BasePlacement | VariationPlacement;
