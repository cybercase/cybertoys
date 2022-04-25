import { debounce } from "./utils";

export type SessionKey = string;

export class SessionService {
  store = new Map<string, string>();

  save<T>(key: SessionKey, value: T) {
    this.store.set(key, JSON.stringify(value));
  }

  load<T>(key: SessionKey, defaultValue: T): T {
    const stored = this.store.get(key);
    if (stored === undefined) {
      return defaultValue;
    }
    try {
      return JSON.parse(stored) as T;
    } catch (err) {
      return defaultValue;
    }
  }
}
