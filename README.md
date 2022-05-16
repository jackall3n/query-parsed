# query-parsed 🔎

<p>
<a href="https://www.npmjs.com/query-parsed"><img src="https://img.shields.io/npm/v/query-parsed.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/query-parsed"><img src="https://img.shields.io/npm/l/query-parsed.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/query-parsed"><img src="https://img.shields.io/npm/dm/query-parsed.svg" alt="NPM Downloads" /></a>
</p>

## Blurb

A library for query string type coercion

## Installation

```shell
npm install query-parsed
```

```shell
yarn add query-parsed
```

## Usage

### Parsed

```typescript
import queryparse from 'query-parsed';

// Return Type = { test: number }
const parsed = queryparse.parse("test=1", { test: Number });
```

### Arrays

```typescript
import queryparse from 'query-parsed';

// Return Type = { test: number[] }
const parsed = queryparse.parse("test=1,2", { test: [Number] }, { arrayFormat: "comma" });
```

### Typed

```typescript
import queryparse from 'query-parsed';

// Return Type = { test: string }
const parsed = queryparse.parse<{ test: string }>("test=1");
```

### Default

```typescript
import queryparse from 'query-parsed';

// Return Type = Record<string, string | string[]>
const parsed = queryparse.parse("test=1");
```


## API

### Supported Parse Types

```typescript
String | Boolean | Number
```
