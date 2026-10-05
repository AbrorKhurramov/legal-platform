type EmptyObject = Record<string, unknown>;
export type QueryListKey<K extends EmptyObject = { key: string }> = K;

export class QueryKeyBootstrap<T extends QueryListKey> {
  constructor(private readonly serviceClass: T) {}

  getKey(key: Exclude<keyof T, "key">, ...dynamic: Array<unknown>) {
    return [this.serviceClass.key, key, ...dynamic];
  }

  getRootKey() {
    return [this.serviceClass.key];
  }
}
