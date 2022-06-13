@leptonite/environment-parser
=============================

`@leptonite/environment-parser` helps getting and validating values from environment variables.

```typescript
// create an EnvironmentParser for the environment of this process
const envParser = new EnvironmentParser();

// create an EnvironmentParser for a custom environment
const customEnvParser = new EnvironmentParser({
   SOME: 'value',
   FOO: 'bar',
});


// get mandatory string value
// throws Error if VAR is not set
const mandatoryString = envParser.getString('VAR');

// get and validate mandatory string value
// throws Error if VAR is not set or does not match the given pattern
const validatedMandatoryString = envParser.getString('VAR', /^[a-zA-Z0-9]{10,20}$/u);

// get optional string value
// returns undefined if VAR is not set
const optionalString = envParser.getOptionalString('VAR');

// get and validate optional string value
// returns undefined if VAR is not set
// throws Error if VAR does not match the given pattern
const validatedOptionalString = envParser.getOptionalString('VAR', /^[a-zA-Z0-9]{10,20}$/u);


// get mandatory integer value
// throws Error if VAR is not set
const mandatoryInteger = envParser.getInteger('VAR');

// get and validate mandatory integer value
// throws Error if VAR is not set or does not meet the given requirements
const validatedMandatoryInteger = envParser.getInteger('VAR', { min: 1, max: 999 });

// get optional integer value
// returns undefined if VAR is not set
const optionalInteger = envParser.getOptionalInteger('VAR');

// get and validate optional integer value
// returns undefined if VAR is not set
// throws Error if VAR does not match the given pattern
const validatedOptionalInteger = envParser.getOptionalInteger('VAR', { min: 1, max: 999 });
```

The `getOptionalString()` and `getOptionalInteger()` methods don’t support default values. Use `envParser.getOptionalString('VAR') ?? 'default'` instead.
