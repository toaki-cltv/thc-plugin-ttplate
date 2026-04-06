# thc-plugin-ttplate

Official title-template plugin for tanstack-head-controller.

This plugin appends a site name to route titles using a configurable separator.

## Installation

```bash
pnpm add tanstack-head-controller thc-plugin-ttplate
```

## Usage

```tsx
import { createHeadController } from 'tanstack-head-controller'
import { thcTitleTemplate } from 'thc-plugin-ttplate'

const thc = createHeadController({
  plugins: [
    thcTitleTemplate({
      siteName: 'My App',
      separator: ' | ',
    }),
  ],
})
```

## Documentation

- [Usage Guide](https://thc.tkcl.tv/en/docs/usage)
