import { Registry } from "./Registry";

export function Inject(implementationId: string) {
  return (target: any, propertyKey: any, propertyIndex: number) => {
    Reflect.defineMetadata(`inject:${propertyIndex}`, implementationId, target);
  }
}
