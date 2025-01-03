type Constructor<T> = new (...args: any) => T;

export class Registry {
  private readonly services: Map<string, Constructor<any>> = new Map();

  private static instance: Registry;

  private constructor() { }

  static getInstance() {
    if (!this.instance) {
      this.instance = new Registry();
    }

    return this.instance;
  }

  register<T>(implementation: Constructor<T>) {
    const name = implementation.name;

    if (this.services.has(name)) {
      throw new Error(`"${name}" is already registered`);
    }

    this.services.set(name, implementation);
  }

  resolve<T>(implementation: Constructor<T>): T {
    const name = implementation.name;

    const service = this.services.get(name);

    if (!service) {
      throw new Error(`"${name}" not found in registry`);
    }

    return new service();
  }
}
