import { EnvironmentParser } from './EnvironmentParser';


const testEnv: NodeJS.ProcessEnv = {
   'USER': 'testuser',
   'HOME': '/home/testuser',
   'PORT': '123',
};

describe('EnvironmentParser', () => {

   test('getString', () => {
      const envParser = new EnvironmentParser(testEnv);
      expect(envParser.getString('USER')).toBe('testuser');
      expect(envParser.getString('HOME')).toBe('/home/testuser');
      expect(() => envParser.getString('MISSING')).toThrowError('environment variable MISSING is missing');
   });

   test('getOptionalString', () => {
      const envParser = new EnvironmentParser(testEnv);
      expect(envParser.getOptionalString('USER')).toBe('testuser');
      expect(envParser.getOptionalString('HOME')).toBe('/home/testuser');
      expect(envParser.getOptionalString('MISSING')).toBeUndefined();
   });

   test('getString with pattern', () => {
      const envParser = new EnvironmentParser(testEnv);
      expect(envParser.getString('USER', /^[a-z]+$/u)).toBe('testuser');
      expect(() => envParser.getString('HOME', /^[a-z]+$/u)).toThrowError('environment variable HOME does not match pattern /^[a-z]+$/');
      expect(() => envParser.getString('MISSING', /^[a-z]+$/u)).toThrowError('environment variable MISSING is missing');
   });

   test('getOptionalString with pattern', () => {
      const envParser = new EnvironmentParser(testEnv);
      expect(envParser.getOptionalString('USER', /^[a-z]+$/u)).toBe('testuser');
      expect(() => envParser.getOptionalString('HOME', /^[a-z]+$/u)).toThrowError('environment variable HOME does not match pattern /^[a-z]+$/');
      expect(envParser.getOptionalString('MISSING', /^[a-z]+$/u)).toBeUndefined();
   });

   test('getInteger', () => {
      const envParser = new EnvironmentParser(testEnv);
      expect(envParser.getInteger('PORT')).toBe(123);
      expect(envParser.getInteger('PORT', { min: 1, max: 65535 })).toBe(123);
      expect(envParser.getInteger('PORT', { min: 123 })).toBe(123);
      expect(envParser.getInteger('PORT', { max: 123 })).toBe(123);
      expect(envParser.getInteger('PORT', { min: 123, max: 123 })).toBe(123);
      expect(() => envParser.getInteger('USER')).toThrowError('environment variable USER is not a safe integer');
      expect(() => envParser.getInteger('PORT', { min: 124 })).toThrowError('environment variable PORT must be >= 124');
      expect(() => envParser.getInteger('PORT', { max: 122 })).toThrowError('environment variable PORT must be <= 122');
      expect(() => envParser.getInteger('PORT', { min: 124, max: 65535 })).toThrowError('environment variable PORT must be >= 124');
      expect(() => envParser.getInteger('PORT', { min: 1, max: 122 })).toThrowError('environment variable PORT must be <= 122');
      expect(() => envParser.getInteger('MISSING')).toThrowError('environment variable MISSING is missing');
   });

   test('getOptionalInteger', () => {
      const envParser = new EnvironmentParser(testEnv);
      expect(envParser.getOptionalInteger('PORT')).toBe(123);
      expect(envParser.getOptionalInteger('PORT', { min: 1, max: 65535 })).toBe(123);
      expect(envParser.getOptionalInteger('PORT', { min: 123 })).toBe(123);
      expect(envParser.getOptionalInteger('PORT', { max: 123 })).toBe(123);
      expect(envParser.getOptionalInteger('PORT', { min: 123, max: 123 })).toBe(123);
      expect(() => envParser.getOptionalInteger('USER')).toThrowError('environment variable USER is not a safe integer');
      expect(() => envParser.getOptionalInteger('PORT', { min: 124 })).toThrowError('environment variable PORT must be >= 124');
      expect(() => envParser.getOptionalInteger('PORT', { max: 122 })).toThrowError('environment variable PORT must be <= 122');
      expect(() => envParser.getOptionalInteger('PORT', { min: 124, max: 65535 })).toThrowError('environment variable PORT must be >= 124');
      expect(() => envParser.getOptionalInteger('PORT', { min: 1, max: 122 })).toThrowError('environment variable PORT must be <= 122');
      expect(envParser.getOptionalInteger('MISSING')).toBeUndefined();
   });

   test('use process.env as default environment', () => {
      const envParser = new EnvironmentParser();
      for (const [key, value] of Object.entries(process.env)) {
         expect(envParser.getString(key)).toBe(value);
      }
   });

});
