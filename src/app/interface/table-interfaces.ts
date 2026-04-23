export interface TableColumn {
  key: string;      // The property name in your data (e.g., 'email')
  label: string;    // The display name for the header (e.g., 'Email Address')
  type?: 'text' | 'badge' | 'avatar'; // To handle special styling
}