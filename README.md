# rtype

WARNING! This repo is still a work in progress. Please contribute if you're interested ❤️

[![build status](https://github.com/aeroview/rtype/actions/workflows/release.yml/badge.svg)](https://github.com/mhweiner/express-typed-rpc/actions)
[![semantic-release](https://img.shields.io/badge/semantic--release-e10079?logo=semantic-release)](https://github.com/semantic-release/semantic-release)
[![Conventional Commits](https://img.shields.io/badge/Conventional%20Commits-1.0.0-yellow.svg)](https://conventionalcommits.org)
[![SemVer](https://img.shields.io/badge/SemVer-2.0.0-blue)]()

Simple and extensible runtime input validation for TS/JS, written in TS.

- Native Typescript support
- No dependencies
- Extensible
- Much faster than joi, yup, and zod (will provide benchmarks soon)

## Installation

```bash
npm i @aeroview-io/rtype
```
 
## Example Usage

### server.ts
```typescript
import express from 'express';
import { Router } from 'express';
import { createAPI, InferAPI } from 'express-typed-rpc/dist/server';

const apiRouter = Router();

const api = {
    greet: (name: string): string => `Hello, ${name}!`,
    multiply: (args: {a: number, b: number}): number => args.a * args.b
};

createAPI(apiRouter, api);

// Export type for use on client
export type API = InferAPI<typeof api>;

const app = express();

app.use('/api', apiRouter);
app.listen(process.env.PORT || 3000);
```

### dom-client.ts
```typescript
import {client} from 'express-typed-rpc/dist/client';
import type {API} from '@yourorg/server' 

const greet = async (name: string): Promise<string> => {
    return await client<API['greet']>('greet', name, {
        endpoint: 'https://api.yourdomain.com',
        options: {} // fetch options (window.RequestInit)
    });
};

const multiply = async (numbers: {a: number, b: number}): Promise<number> => {
    return await client<API['multiply']>('multiply', numbers, {
        endpoint: 'https://api.yourdomain.com',
        options: {} // fetch options (window.RequestInit)
    });
};
```

### node-client.ts
```typescript
import {client} from 'express-typed-rpc/dist/client-node';
import type {API} from '@yourorg/server'

const greet = async (name: string): Promise<string> => {
    return await client<API['greet']>('greet', name, {
        endpoint: 'https://api.yourdomain.com',
        options: {} // https.RequestOptions
    });
};

const multiply = async (numbers: {a: number, b: number}): Promise<number> => {
    return await client<API['multiply']>('multiply', numbers, {
        endpoint: 'https://api.yourdomain.com',
        options: {} // https.RequestOptions
    });
};
```

You must publish your backend as a private repo (Github Packages is recommended). Only the Typescript types are exported/imported and does not affect runtime. You will enjoy the same performance but with IDE autocompletion, validation, 
and compile-time TypeScript errors.

## Contribution

Please contribute to this project! Issue a PR against `main` and request review. 

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
