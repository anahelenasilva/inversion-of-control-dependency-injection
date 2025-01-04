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

  /**
   *
   * @param implementationId -> identifier of the implementation; usually the name of the implementation, the implementation identifier inside the container
   * @param implementation
   */
  register<T>(implementationId: string, implementation: Constructor<T>) {
    if (this.services.has(implementationId)) {
      throw new Error(`"${implementationId}" is already registered`);
    }

    this.services.set(implementationId, implementation);
  }

  resolve<T>(implementationId: string): T {
    const implementation = this.services.get(implementationId);

    if (!implementation) {
      throw new Error(`"${implementationId}" not found in registry`);
    }

    const paramTypes: any[] = Reflect.getMetadata("design:paramtypes", implementation) ?? [];

    const dependencies = paramTypes.map((_, index) => {
      const dependencyId = Reflect.getMetadata(`inject:${index}`, implementation);

      if (!dependencyId) {
        throw new Error(`Dependency not found for index ${index}`);
      }

      return this.resolve(dependencyId);
    });

    return new implementation(...dependencies);
  }
}
