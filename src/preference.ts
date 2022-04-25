import { debounce } from "./utils";

export type PreferenceKey = string;

export class PreferenceService {
  saveDebounced = debounce(this.save, 500);

  save<T>(key: PreferenceKey, value: T) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  load<T>(key: PreferenceKey, defaultValue: T): T {
    const stored = localStorage.getItem(key);
    if (stored === null) {
      return defaultValue;
    }
    try {
      return JSON.parse(stored) as T;
    } catch (err) {
      return defaultValue;
    }
  }
}
