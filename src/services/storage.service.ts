export const CITIES_STORAGE_KEY = "CITIES_STORAGE_KEY";

class StorageService {
  private storage!: Storage;

  constructor(storage: Storage) {
    this.storage = storage;
  }

  get<T>(key: string): T | null {
    const value: string | null = this.storage.getItem(key);
    if (value === null) return null;
    const result = JSON.parse(value);
    return result.value;
  }

  set<T>(key: string, value: T, ttl = Infinity) {
    const str: string | null = this.storage.getItem(key);
    if (str !== null) {
      const currentValue = JSON.parse(str);
      const isValueExpired =
        currentValue.hasOwnProperty("_expiry") &&
        currentValue._expiry !== null &&
        currentValue._expiry < new Date().getTime();
      if (isValueExpired) {
        this.remove(key);
      }
    }
    const _expiry = new Date().getTime() + ttl;
    const payload = {
      value,
      _expiry,
    };
    this.storage.setItem(key, JSON.stringify(payload));
  }

  remove(key: string) {
    this.storage.removeItem(key);
  }
}

const storageService = new StorageService(window.localStorage);

export default storageService;
