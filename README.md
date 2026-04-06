# thc-plugin-merge

Official merge plugin for tanstack-head-controller.

This plugin merges duplicate-like `meta` entries (same `name`) so route-level head data can be composed safely.

## Installation

```bash
pnpm add tanstack-head-controller thc-plugin-merge
```

## Usage

```tsx
import { createHeadController } from 'tanstack-head-controller'
import { thcMerge } from 'thc-plugin-merge'

const thc = createHeadController({
  plugins: [thcMerge()],
})
```

## Documentation

- [Usage Guide](https://thc.tkcl.tv/en/docs/usage)
