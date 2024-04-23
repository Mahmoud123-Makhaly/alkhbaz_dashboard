type RGBYSoftType = 'warning' | 'danger' | 'secondary' | 'info' | 'primary' | 'success' | 'light'|'dark';
export interface IRGBYSoft extends Partial<Record<RGBYSoftType, any>> {}
