# semantic-version-utils

A lightweight, zero-dependency TypeScript utility for normalizing and comparing version strings. Built to handle standard semantic versioning as well as extended multi-segment formats (often found in firmware and legacy systems).

## Installation

```bash
npm install semantic-version-utils
```

## Features

- **Normalization**: Handles prefixes like `v`, `version`, or whitespace automatically.
- **Flexible Comparison**: Supports standard (1.5.0) and multi-segment (1.7.1.10.b2) formats.
- **General Purpose**: Works with strings or arrays of objects with customizable extractors.
- **Fail-safe**: Robust handling of `null`, `undefined`, and unexpected inputs.

## Usage

### Simple Comparison

```typescript
import { compare } from 'semantic-version-utils';

compare('1.2.3', '1.2.4'); // -1 (lower)
compare('1.5', '1.5.0');   // 0 (equal)
compare('v2.0', '1.9.9');  // 1 (greater)
```

### Minimum Version Check

```typescript
import { isAtLeast } from 'semantic-version-utils';

isAtLeast('1.10.2', '1.8.0'); // true
isAtLeast('1.5.0', '2.0.0');  // false
```

### Finding the Latest Version

The `latest()` function is highly versatile and works with different data structures:

```typescript
import { latest } from 'semantic-version-utils';

// Array of strings
latest(['1.0.0', '1.5.2', '1.2.0']); // '1.5.2'

// Array of objects with property name
const releases = [{ rel: '1.0' }, { rel: '1.2' }];
latest(releases, 'rel'); // '1.2'

// Array of objects with extractor function
const data = [{ info: { v: '2.0' } }, { info: { v: '2.1' } }];
latest(data, (item) => item.info.v); // '2.1'

// Fallback search (automatically checks 'version', 'versionCode', 'tag')
latest([{ tag: 'v1.0' }, { tag: 'v1.1' }]); // 'v1.1'
```

### Normalization

```typescript
import { normalize } from 'semantic-version-utils';

normalize('  version-1.7.1  '); // '1.7.1'
```

## Developer

**Fábio José Reis**  
[LinkedIn Profile](https://www.linkedin.com/in/fabiojosereis/)

## License

MIT
