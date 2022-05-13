import { debounce } from "./utils";

export type SessionKey = string;

export class SessionService {
  store = new Map<string, any>();

  save<T>(key: SessionKey, value: T) {
    this.store.set(key, value);
  }

  load<T>(key: SessionKey, defaultValue: T): T {
    const stored = this.store.get(key);
    if (stored === undefined) {
      return defaultValue;
    }
    return stored;
  }
}
