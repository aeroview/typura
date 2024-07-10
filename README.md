<picture>
    <source srcset="docs/typura.svg" media="(prefers-color-scheme: dark)">
    <source srcset="docs/typura.svg" media="(prefers-color-scheme: light)">
    <img src="docs/typura.svg" alt="Logo" style="margin: 0 0 10px" size="250">
</picture>

[![build status](https://github.com/aeroview/typura/actions/workflows/release.yml/badge.svg)](https://github.com/mhweiner/express-typed-rpc/actions)
![Code Coverage](https://img.shields.io/badge/Code%20Coverage%20-%20100%25%20-%20%2331c352)
[![SemVer](https://img.shields.io/badge/SemVer-2.0.0-blue)]()
[![Conventional Commits](https://img.shields.io/badge/Conventional%20Commits-1.0.0-yellow.svg)](https://conventionalcommits.org)

Simple, extensible, and reliable runtime input validation for TS/JS.

Sponsored by https://aeroview.io

**🚀 Fast & reliable performance**

- Faster than joi, yup, and zod (benchmarks coming soon)
- Supports tree-shaking via ES Modules so you only bundle what you use
- No dependencies
- 100% test coverage

**😀 User-friendly & powerful**

- Native Typescript support with readable types
- Easy-to-use declarative & functional API
- Client-friendly, predictable, & structured error messages
- Works great both on the server and in the browser
- Composable and extensible with custom predicates

**🔋 Batteries included**

- Built-in support for email, urls, uuids, regex, enums, passwords, and more!

# Installation

```bash
npm i typura
```

# Table of contents

- [Example](#example)
- [The "Result" pattern](#using-the-result-pattern)
- [Taking advantage of tree-shaking](#taking-advantage-of-tree-shaking)
- [Nested objects](#nested-objects)
- [Type API](#type-api)
- [Predicate API](#predicate-api)
- [Advanced Usage](#advanced-usage)
- [Contribution](#contribution)
- [Sponsorship](#get-better-observability-with-aeroview)
 
# Usage

## Example

```typescript
import {predicates as p, Infer} from 'typura';

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

/* demonstrating type narrowing */

const input = {
    email: 'john@smith.com',
    password: 'Password1$',
    name: 'John Doe',
    favoriteColor: 'red',
    mustBe42: 42,
} as unknown; // unknown type to simulate unknown user input

try {
    if (validator(input)) {
        // input is now typed as User
        input.favoriteColor; // FavoriteColor
    }
} catch (e) {
    if (e instanceof ValidationError) {
        console.log(e.messages);
    }
    throw e; // don't forget to rethrow your unhanded errors!
}
```

## Using the "Result" pattern

```typescript
import {predicates as p, ValidationError, toResult} from 'typura';

const validator = p.object({
    email: p.email(),
    password: p.password(),
});

const input = {
    email: '',
    password: '',
}

const [err] = toResult(() => validator(input));

if (err instanceof ValidationError) {
    console.log(err.messages); // {email: 'must be a valid email address', password: 'must include at least one uppercase letter'}
}
```

## Taking advantage of tree-shaking

R-type is tree-shakeable. This means that you can import only the predicates you need and the rest of the library will not be included in your bundle.

This is useful for frontend applications where bundle size is a concern. As a bonus, this allows our repo to contain a large number of predicates for convenience without bloating your bundle. Best of both worlds!

```typescript
import {email} from 'typura/dist/predicates';

const isEmail = email();
```

## Nested objects 

You can nest objects by using the `object` predicate. This allows you to create complex validation rules for nested objects. The `ValidationError` object will be flattened to include the nested object keys with a dot separator.

```typescript
import {predicates as p, Infer} from 'typura';

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

# Type API

## `Infer<T>`

Infer is a utility type that extracts the type of the input from a predicate function. See the [example above](#example-usage) for usage.

## `Pred<T>` 

A type gaurd that takes an input and returns a boolean. It is used to narrow the type of the input to the type that the predicate is checking for. Every predicate function in our API returns a `Pred<T>`.

Example:

```typescript
import {Pred} from 'typura';

const isNumber: Pred<number> = (input: unknown): input is number => typeof input === 'number';
```

# Predicate API

## boolean

`boolean(): Pred<boolean>` 

Returns a predicate that checks if the input is a boolean.

## number

`number(opts?: Options): Pred<number>`

Returns a predicate that checks if the input is a number.

Options:

- `range`: `{min: number, max: number} | undefined` - checks if the input is within the specified range

Example:

```typescript
import {number} from 'typura/dist/predicates';
const isNumber = number({range: {min: 0, max: 100}});
```

## string

`string(opts?: Options): Pred<string>`

Returns a predicate that checks if the input is a string.

Options:

- `len`: `{min: number, max: number} | undefined` - checks if the input is within the specified length

## object

`object<T>(predicates: {[K in keyof T]: Pred<T[K]>}, opts?: Options): Pred<T>`

Returns a predicate that checks if the input is an object with the specified keys and values.

Options:

- `allowUnknownKeys` - allows unspecified/unexpected keys in the object, default is `false`

## array
`array<T>(predicate: Pred<T>): Pred<T[]>`

Returns a predicate that checks if the input is an array of the specified type.

## enum

`enumValue<T>(enumType: T): Pred<T[keyof T]>`

Returns a predicate that checks if the input is a value of the specified enum.

## optional

`optional<T>(predicate: Pred<T>): Pred<T | undefined>`

Returns a predicate that checks if the input is either the type of the predicate or `undefined`.

## custom

`custom<T>(predicate: (input: T) => boolean, message: string): Pred<T>`

Returns a predicate that checks if the input passes a custom function.

Example:

```typescript
import {custom} from 'typura/dist/predicates';

const is42 = custom((input: number) => input === 42, 'must be 42');

is42(42); // true
is42(43); // throws ValidationError: 'must be 42'

```

## regex

`regex(exp: RegExp, message: string): Pred<string>`

Returns a predicate that checks if the input passes the provided regular expression.

Example:

```typescript
import {regex} from 'typura/dist/predicates';

regex(/^[a-z]+$/, 'not a-z')('abc'); // true
regex(/^[a-z]+$/, 'not a-z')('123'); // throws ValidationError: 'not a-z'

```

## chain

`chain<T>(...predicates: Pred<T>[]): Pred<T>`

Returns a predicate that chains multiple predicates together. The input must pass all predicates. Predicates are checked in order. If a predicate fails, the rest of the predicates are not checked. Predicates must be of the same type `T`.

Example:

```typescript
import {chain, email, custom} from 'typura/dist/predicates';

const isSchoolEmail = chain(
    email(), 
    custom((input: string) => /.+[.edu]$/.test(input), 'must be a school email')
);
```

## email

`email(): Pred<string>`

Returns a predicate that checks if the input is a valid email address.

## password

`password(): Pred<string>`

Returns a predicate that checks if the input is a valid password. A valid password must:

- Be at least 8 characters long
- Include at least one uppercase letter
- Include at least one lowercase letter
- Include at least one number
- Include at least one special character

## uuid
`uuid(): Pred<string>`

Returns a predicate that checks if the input is a valid UUID v4.

## url
`url(opts?: Options): Pred<string>`

Returns a predicate that checks if the input is a valid URL.

Options:

- `allowLocalhost` - allows localhost URLs, default is `false`

# Advanced Usage

## Defining validation at runtime while using static `Infer` type at compile-time

You can use the `custom()` predicate to define a predicate at runtime, while still using the `Infer` type at compile-time. This is useful when you need to define a predicate based on user input or configuration.

```typescript
import {predicates as p, Infer} from 'typura';

const validator = p.custom((input: string) => {
    
    const regEx = getRegExFromSomewhere();

    return p.regex(regEx, 'invalid regex')(input);

});

type Input = Infer<typeof validator>; // string

```

# Support, Feedback, and Contributions

- Star this repo if you like it!
- Submit an [issue](https://github.com/mhweiner/jsout/issues) with your problem, feature request or bug report
- Issue a PR against `main` and request review. Make sure all tests pass and coverage is good.
- Write about `typura` in your blog, tweet about it, or share it with your friends!

# Sponsors

<picture>
    <source srcset="docs/aeroview-logo-lockup.svg" media="(prefers-color-scheme: dark)">
    <source srcset="docs/aeroview-logo-lockup-dark.svg" media="(prefers-color-scheme: light)">
    <img src="docs/aeroview-logo-lockup-dark.svg" alt="Logo" style="max-width: 150px;margin: 0 0 10px">
</picture>

Aeroview is a developer-friendly, AI-powered observability platform that helps you monitor, troubleshoot, and optimize your applications. Get started for free at [https://aeroview.io](https://aeroview.io).
