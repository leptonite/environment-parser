import { parseIntStrict } from '@leptonite/parse-int-strict';


function required<T>(name: string, value: T | undefined): T {
   if (value === undefined) {
      throw new Error(`environment variable ${name} is missing`);
   }

   return value;
}

export class EnvironmentParser {

   public constructor(
      private readonly env: NodeJS.ProcessEnv = process.env,
   ) {
   }

   public getOptionalString(name: string, pattern?: RegExp): string | undefined {
      const value = this.env[name];
      if (value !== undefined && pattern && !pattern.test(value)) {
         throw new Error(`environment variable ${name} does not match pattern ${pattern}`);
      }
      return value;
   }

   public getString(name: string, pattern?: RegExp): string {
      return required(name, this.getOptionalString(name, pattern));
   }

   public getOptionalInteger(name: string, { min, max }: { min?: number, max?: number; } = {}): number | undefined {
      const value = this.env[name];
      if (value === undefined) {
         return undefined;
      }

      const intValue = parseIntStrict(value);
      if (isNaN(intValue)) {
         throw new Error(`environment variable ${name} is not a safe integer`);
      }

      if (min !== undefined && intValue < min) {
         throw new Error(`environment variable ${name} must be >= ${min}`);
      }

      if (max !== undefined && intValue > max) {
         throw new Error(`environment variable ${name} must be <= ${max}`);
      }

      return intValue;
   }

   public getInteger(name: string, { min, max }: { min?: number, max?: number; } = {}): number {
      return required(name, this.getOptionalInteger(name, { min, max }));
   }

}
