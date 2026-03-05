# chrome-manifest-builder

> Programmatic manifest.json builder for Chrome extensions with TypeScript support, fluent API, and validation.

[![npm version](https://img.shields.io/npm/v/chrome-manifest-builder)](https://npmjs.com/package/chrome-manifest-builder)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue.svg)](https://www.typescriptlang.org/)

**chrome-manifest-builder** provides a fluent TypeScript API for generating Chrome Extension Manifest V3 (`manifest.json`) files programmatically. Say goodbye to manually writing JSON and hello to type-safe, validated manifest generation.

## Why Use chrome-manifest-builder?

- **Type-safe** — Full TypeScript support with autocomplete for all manifest fields
- **Fluent API** — Chain methods for readable, declarative manifest configuration
- **Validation** — Built-in validation ensures your manifest meets Chrome Web Store requirements
- **Zero dependencies** — Lightweight, no external runtime dependencies
- **Manifest V3** — Built for modern Chrome extensions

## Installation

```bash
npm install chrome-manifest-builder
```

Or with yarn:

```bash
yarn add chrome-manifest-builder
```

## Quick Start

```typescript
import { ManifestBuilder } from 'chrome-manifest-builder';

const manifest = new ManifestBuilder()
  .name('My Extension')
  .version('1.0.0')
  .description('A Chrome extension built with manifest-builder')
  .permissions('storage', 'tabs')
  .hostPermissions('https://*/*')
  .background('background.js')
  .action('popup.html', { '16': 'icon16.png', '128': 'icon128.png' })
  .icons({
    '16': 'icon16.png',
    '48': 'icon48.png',
    '128': 'icon128.png'
  })
  .build();

// Output as JSON
console.log(JSON.stringify(manifest, null, 2));
```

This generates:

```json
{
  "manifest_version": 3,
  "name": "My Extension",
  "version": "1.0.0",
  "description": "A Chrome extension built with manifest-builder",
  "permissions": [
    "storage",
    "tabs"
  ],
  "host_permissions": [
    "https://*/*"
  ],
  "background": {
    "service_worker": "background.js"
  },
  "action": {
    "default_popup": "popup.html",
    "default_icon": {
      "16": "icon16.png",
      "128": "icon128.png"
    }
  },
  "icons": {
    "16": "icon16.png",
    "48": "icon48.png",
    "128": "icon128.png"
  }
}
```

## API Reference

### Constructor

```typescript
new ManifestBuilder()
```

Creates a new ManifestBuilder instance. Automatically sets `manifest_version: 3`.

### Core Fields

| Method | Description |
|--------|-------------|
| `name(name: string)` | Sets the extension name (required) |
| `version(version: string)` | Sets the semantic version (required) |
| `description(desc: string)` | Sets the extension description |

### Permissions

| Method | Description |
|--------|-------------|
| `permissions(...perms: string[])` | Adds API permissions (storage, tabs, etc.) |
| `hostPermissions(...hosts: string[])` | Adds host permissions (URLs/patterns) |

```typescript
// Add multiple permissions at once
.permissions('storage', 'tabs', 'scripting')

// Add host permissions
.hostPermissions('https://example.com/*', 'https://api.example.com/*')
```

### Background Script

| Method | Description |
|--------|-------------|
| `background(serviceWorker: string, type?: string)` | Sets the background service worker |

```typescript
.background('background.js')  // Basic
.background('background.js', 'module')  // As ES module
```

### Content Scripts

| Method | Description |
|--------|-------------|
| `contentScript(matches: string[], js?: string[], css?: string[], runAt?: string)` | Adds a content script configuration |

```typescript
.contentScript(
  ['https://*/*'],           // Match patterns
  ['content.js'],            // JS files
  ['styles.css'],            // CSS files
  'document_idle'           // Run timing
)
```

### Browser Action

| Method | Description |
|--------|-------------|
| `action(popup?: string, icon?: Record<string, string>)` | Configures the browser action/popup |

```typescript
.action('popup.html')  // Just popup
.action('popup.html', { '16': 'icon16.png', '128': 'icon128.png' })  // With icons
```

### Icons

| Method | Description |
|--------|-------------|
| `icons(icons: Record<string, string>)` | Sets the extension icons |

```typescript
.icons({
  '16': 'images/icon16.png',
  '48': 'images/icon48.png',
  '128': 'images/icon128.png'
})
```

### Options Page

| Method | Description |
|--------|-------------|
| `optionsPage(page: string)` | Sets the options page URL |

```typescript
.optionsPage('options.html')
```

### Commands (Keyboard Shortcuts)

| Method | Description |
|--------|-------------|
| `commands(cmds: Record<string, CommandConfig>)` | Defines keyboard shortcuts |

```typescript
.commands({
  'open-popup': {
    description: 'Open the extension popup',
    suggested_key: { default: 'Ctrl+Shift+P', mac: 'Command+Shift+P' }
  }
})
```

### Web Accessible Resources

| Method | Description |
|--------|-------------|
| `webAccessibleResources(resources: string[], matches: string[])` | Makes resources accessible to web pages |

```typescript
.webAccessibleResources(
  ['images/*.png', 'fonts/*.woff2'],
  ['https://example.com/*']
)
```

### Custom Fields

| Method | Description |
|--------|-------------|
| `set(key: string, value: any)` | Sets any custom manifest field |

```typescript
.set('oauth2', {
  client_id: 'your-client-id.apps.googleusercontent.com',
  scopes: ['https://www.googleapis.com/auth/drive']
})
```

### Build & Output

| Method | Description |
|--------|-------------|
| `build()` | Returns the manifest object |
| `toJSON(indent?: number)` | Returns the manifest as a JSON string |
| `validate()` | Returns an array of validation errors |

```typescript
// Get as object
const manifest = builder.build();

// Get as formatted JSON string
const json = builder.toJSON(4);

// Validate before building
const errors = builder.validate();
if (errors.length > 0) {
  console.error('Validation failed:', errors);
}
```

## Validation

The builder includes built-in validation that checks for:

- Required fields: `name`, `version`, `manifest_version`
- Valid manifest version (must be 3)

```typescript
const builder = new ManifestBuilder()
  .name('My Extension')
  .version('1.0.0');

const errors = builder.validate();
// Returns: ['Missing required field: manifest_version']

// Valid manifest
const valid = new ManifestBuilder()
  .name('My Extension')
  .version('1.0.0');

valid.validate(); // Returns: []
```

## Complete Example

Here's a full example demonstrating a typical Chrome extension setup:

```typescript
import { ManifestBuilder } from 'chrome-manifest-builder';
import * as fs from 'fs';

const manifest = new ManifestBuilder()
  .name('My Awesome Extension')
  .version('1.0.0')
  .description('Does amazing things')
  
  // Permissions
  .permissions('storage', 'tabs', 'scripting')
  .hostPermissions('https://*.google.com/*')
  
  // Background
  .background('background.js', 'module')
  
  // Content scripts
  .contentScript(
    ['https://*/*'],
    ['content.js'],
    ['content.css'],
    'document_idle'
  )
  
  // Action
  .action('popup.html', { '16': 'icon16.png', '128': 'icon128.png' })
  
  // Icons
  .icons({
    '16': 'icon16.png',
    '48': 'icon48.png',
    '128': 'icon128.png'
  })
  
  // Options page
  .optionsPage('options.html')
  
  // Keyboard commands
  .commands({
    'toggle-feature': {
      description: 'Toggle the main feature',
      suggested_key: { default: 'Ctrl+Shift+F' }
    }
  })
  
  // Web accessible resources
  .webAccessibleResources(
    ['images/*', 'fonts/*'],
    ['https://*/*']
  })
  
  // Validate
  .validate();

if (manifest.validate().length > 0) {
  console.error('Invalid manifest:', manifest.validate());
  process.exit(1);
}

// Write to file
fs.writeFileSync('manifest.json', manifest.toJSON(2));
console.log('Manifest created successfully!');
```

## TypeScript

This package ships with TypeScript type definitions. All methods are fully typed:

```typescript
import { ManifestBuilder } from 'chrome-manifest-builder';

const builder = new ManifestBuilder()
  .name('My Extension')      // string
  .version('1.0.0')           // string
  .permissions('storage');   // autocomplete for valid permissions
```

## License

MIT License — see the [LICENSE](LICENSE) file for details.

---

Built by [Zovo](https://zovo.one)
