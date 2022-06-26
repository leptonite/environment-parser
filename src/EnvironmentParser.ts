import { parseIntStrict } from '@leptonite/parse-int-strict';


export interface GetIntegerOptions {
   min?: number;
   max?: number;
}

export class EnvironmentParser {

   public constructor(
      private readonly env: NodeJS.ProcessEnv = process.env,
   ) {
   }

   public getOptionalString(name: string, pattern?: RegExp): string | undefined {
      const value = this.env[name];
      if (value === undefined) {
         return undefined;
      }

      if (pattern && !pattern.test(value)) {
         throw new Error(`environment variable ${name} does not match pattern ${pattern}`);
      }

      return value;
   }

   public getString(name: string, pattern?: RegExp): string {
      return required(name, this.getOptionalString(name, pattern));
   }

   public getOptionalInteger(name: string, { min, max }: GetIntegerOptions = {}): number | undefined {
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

   public getInteger(name: string, { min, max }: GetIntegerOptions = {}): number {
      return required(name, this.getOptionalInteger(name, { min, max }));
   }

   public getOptionalOneOf<T extends string>(name: string, values: Array<T>): T | undefined {
      const value = this.env[name];
      if (value === undefined) {
         return undefined;
      }

      if (!(values as Array<string>).includes(value)) {
         throw new Error(`environment variable ${name} must be one of ${JSON.stringify(values)}`);
      }

      return value as T;
   }

   public getOneOf<T extends string>(name: string, values: Array<T>): T {
      return required(name, this.getOptionalOneOf(name, values));
   }

}

function required<T>(name: string, value: T | undefined): T {
   if (value === undefined) {
      throw new Error(`environment variable ${name} is missing`);
   }

   return value;
}
