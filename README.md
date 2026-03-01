# chrome-manifest-builder — Programmatic MV3 Manifest
> **Built by [Zovo](https://zovo.one)** | `npm i chrome-manifest-builder`

Fluent builder for manifest.json with typed fields, permission helpers, validation, and JSON output.

```typescript
import { ManifestBuilder } from 'chrome-manifest-builder';
const manifest = new ManifestBuilder()
  .name('My Extension').version('1.0.0').description('A cool extension')
  .permissions('storage', 'tabs').background('background.js')
  .action('popup.html', { '128': 'icon.png' }).build();
```
MIT License
