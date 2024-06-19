<picture>
    <source srcset="docs/rtype.svg" media="(prefers-color-scheme: dark)">
    <source srcset="docs/rtype-dark.svg" media="(prefers-color-scheme: light)">
    <img src="docs/rtype-dark.svg" alt="Logo" style="margin: 0 0 10px">
</picture>

---

[![build status](https://github.com/aeroview/rtype/actions/workflows/release.yml/badge.svg)](https://github.com/mhweiner/express-typed-rpc/actions)
[![semantic-release](https://img.shields.io/badge/semantic--release-e10079?logo=semantic-release)](https://github.com/semantic-release/semantic-release)
[![Conventional Commits](https://img.shields.io/badge/Conventional%20Commits-1.0.0-yellow.svg)](https://conventionalcommits.org)
[![SemVer](https://img.shields.io/badge/SemVer-2.0.0-blue)]()

Simple and extensible runtime input validation for TS/JS, written in TS. Sponsored by https://aeroview.io

**🚀 Fast & reliable performance**

- Faster than joi, yup, and zod (benchmarks coming soon)
- Supports tree-shaking via ES Modules so you only bundle what you use
- No dependencies
- 100% test coverage

**😀 User-friendly & defensive**

- Native Typescript support with readable types
- Easy-to-use declarative & functional API
- Client-friendly, structured error messages
- Works great on the server and in the browser
- Composable and extensible with custom predicates

**🔋 Batteries included**

- Email, urls, uuids, enums, passwords, and more

## Installation

```bash
npm i @aeroview-io/rtype
```
 
## Example usage

```typescript
import {predicates as p, Infer} from '@aeroview-io/rtype';

enum FavoriteColor {
    Red = 'red',
    Blue = 'blue',
    Green = 'green',
}

const validator = p.object({
    email: p.email(),
    password: p.password(),
    name: p.string({len: {min: 1, max: 100}}),
    phone: p.optional(p.string()),
    favoriteColor: p.enumValue(FavoriteColor),
    mustBe42: p.custom((input: number) => input === 42, 'must be 42'),
});

type User = Infer<typeof validator>; // {email: string, password: string, name: string, phone?: string, favoriteColor: FavoriteColor, mustBe42: number}

validator({
    email: 'oopsie',
    password: 'password',
    name: 'John Doe',
    favoriteColor: 'red',
});

/* The above throws ValidationError: 
{
    email: 'must be a valid email address',
    password: 'must include at least one uppercase letter',
    mustBe42: 'must be 42',
}
*/

// Using the validator as a type guard

const input = {
    email: 'john@smith.com',
    password: 'Password1$',
    name: 'John Doe',
    favoriteColor: 'red',
    mustBe42: 42,
} as unknown; // unknown type to simulate user input

if (validator(input)) {

    // input is now typed as User
    input.favoriteColor; // FavoriteColor

}
```

## Taking advantage of tree-shaking

R-type is tree-shakeable. This means that you can import only the predicates you need and the rest of the library will not be included in your bundle.

This is useful for frontend applications where bundle size is a concern. As a bonus, this allows our repo to contain a large number of predicates for convenience without bloating your bundle. Best of both worlds!

```typescript
import {email} from '@aeroview-io/rtype/dist/predicates';

const isEmail = email();
```

## Nested objects

You can nest objects by using the `object` predicate. This allows you to create complex validation rules for nested objects. The `ValidationError` object will be flattened to include the nested object keys with a dot separator.

```typescript
import {predicates as p, Infer} from '@aeroview-io/rtype';

const validator = p.object({
    email: p.email(),
    address: p.object({
        line1: p.string(),
        line2: p.optional(p.string()),
        street: p.string(),
        state: p.string(),
        city: p.string({len: {min: 2, max: 2}}),
        zip: p.string(),
    })
});

type User = Infer<typeof validator>; // {email: string, address: {line1: string, line2?: string, street: string, city: string, zip: string}}

validator({
    email: 'blah',
    address: {}
});

/* The above throws ValidationError: 
{
    email: 'must be a valid email address',
    'address.line1': 'must be a string',
    'address.street': 'must be a string',
    'address.state': 'must be a string',
    'address.city': 'must be between 2 and 2 characters long', // Yeah, we should probably fix this :)
    'address.zip': 'must be a string',
}
*/
```

## Type API

### `Infer<T>`

Infer is a utility type that extracts the type of the input from a predicate function.

### `Pred<T>` 

A type gaurd that takes an input and returns a boolean. It is used to narrow the type of the input to the type that the predicate is checking for. Every predicate function in our API returns a `Pred<T>`.

Example:

```typescript
import {Pred} from '@aeroview-io/rtype';

const isNumber: Pred<number> = (input: unknown): input is number => typeof input === 'number';
```

## Predicate API

Every function is based around the idea of a 'predicate.' A predicate is a function that takes an input (the user input/value in question) and returns a boolean.

Every predicate function does the following:

- Returns `true` if the input is valid
- Throws a `ValidationError` if the input is invalid

If you're using Typescript, predicates are also type guards and return a [Type Predicate](https://www.typescriptlang.org/docs/handbook/2/narrowing.html#using-type-predicates) that narrows the type of the input to the type that the predicate is checking for.

### `boolean(): Pred<boolean>` 

Returns a predicate that checks if the input is a boolean.

### `number(opts?: Options): Pred<number>`

Returns a predicate that checks if the input is a number.

Options:

- `range`: `{min: number, max: number} | undefined` - checks if the input is within the specified range

Example:

```typescript
import {number} from '@aeroview-io/rtype/dist/predicates';
const isNumber = number({range: {min: 0, max: 100}});
```

### `string(opts?: Options): Pred<string>`

Returns a predicate that checks if the input is a string.

Options:

- `len`: `{min: number, max: number} | undefined` - checks if the input is within the specified length

### `email(): Pred<string>`

Returns a predicate that checks if the input is a valid email address.

### `password(): Pred<string>`

Returns a predicate that checks if the input is a valid password. A valid password must:

- Be at least 8 characters long
- Include at least one uppercase letter
- Include at least one lowercase letter
- Include at least one number
- Include at least one special character

### `uuid(): Pred<string>`

Returns a predicate that checks if the input is a valid UUID v4.

### `url(opts?: Options): Pred<string>`

Returns a predicate that checks if the input is a valid URL.

Options:

- `allowLocalhost` - allows localhost URLs, default is `false`

### `optional<T>(predicate: Pred<T>): Pred<T | undefined>`

Returns a predicate that checks if the input is either the type of the predicate or `undefined`.

### `object<T>(predicates: {[K in keyof T]: Pred<T[K]>}): Pred<T>`

Returns a predicate that checks if the input is an object with the specified keys and values.

### `enumValue<T>(enumType: T): Pred<T[keyof T]>`

Returns a predicate that checks if the input is a value of the specified enum.

### `custom<T>(predicate: (input: unknown) => boolean, message: string): Pred<T>`

Returns a predicate that checks if the input passes a custom function.

## Contribution

Please contribute to this project! Issue a PR against `main` and request review. Specifically, it would be great if you could help add predicates for common use-cases.

Before you submit a PR, please make sure to do the following:

- Please test your work thoroughly.
- Make sure all tests pass with appropriate coverage.

### How to build locally

```bash
npm i
```

### Running tests

```shell script
npm test
```

## Get better observability with Aeroview

<p><picture>
    <source srcset="docs/aeroview-logo-lockup.svg" media="(prefers-color-scheme: dark)">
    <source srcset="docs/aeroview-logo-lockup-dark.svg" media="(prefers-color-scheme: light)">
    <img src="docs//aeroview-logo-lockup-dark.svg" alt="Logo" style="max-width: 150px;margin: 0 0 10px">
</picture></p>

Aeroview is a developer-friendly, AI-powered observability platform that helps you monitor, troubleshoot, and optimize your applications. Get started for free at [https://aeroview.io](https://aeroview.io).
