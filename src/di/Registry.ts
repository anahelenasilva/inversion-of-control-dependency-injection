import { Constructor } from "../types/utils";

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

    const devModeOnly = Reflect.getMetadata("devModeOnly", service);

    if (devModeOnly && process.env.NODE_ENV !== "development") {
      throw new Error(`"${name}" should be used only in dev mode`);
    }

    const paramTypes: Constructor<any>[] = Reflect.getMetadata("design:paramtypes", service) ?? [];

    const dependencies = paramTypes.map(constructor => this.resolve(constructor));

    return new service(...dependencies);
  }
}
