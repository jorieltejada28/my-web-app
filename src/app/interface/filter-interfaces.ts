export interface FilterField {
  key: string;
  label: string;
  type: 'text' | 'email' | 'select' | 'number';
  options?: string[];
}

export interface FilterLayout {
  desktopCols: number;
  gap: number;
}
