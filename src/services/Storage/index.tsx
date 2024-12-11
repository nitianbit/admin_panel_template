export const getValue = (key: string): string | null => localStorage.getItem(key);
export const setValue = (key: string, value: string): void => localStorage.setItem(key, value);
export const removeValue = (key: string): void => localStorage.removeItem(key);
export const STORAGE_KEYS = {
  TOKEN: 'TOKEN',
};