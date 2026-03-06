# chrome-manifest-builder

Programmatic manifest.json builder for Chrome extensions. Typed fluent API for Manifest V3 with built-in validation. Zero runtime dependencies.

INSTALL

```bash
npm install chrome-manifest-builder
```

QUICK START

```typescript
import { ManifestBuilder } from "chrome-manifest-builder";

const manifest = new ManifestBuilder()
  .name("My Extension")
  .version("1.0.0")
  .description("A Chrome extension built with chrome-manifest-builder")
  .permissions("storage", "tabs")
  .hostPermissions("https://*/*")
  .background("service-worker.js", "module")
  .contentScript(
    ["https://*/*"],
    ["content.js"],
    ["content.css"],
    "document_idle"
  )
  .action("popup.html", { "16": "icon16.png", "128": "icon128.png" })
  .icons({ "16": "icon16.png", "48": "icon48.png", "128": "icon128.png" })
  .optionsPage("options.html")
  .build();

console.log(JSON.stringify(manifest, null, 2));
```

The builder always sets manifest_version to 3. Every setter returns this, so calls chain naturally.

API REFERENCE

ManifestBuilder is the only export. Construct it with new ManifestBuilder() and chain any of the following methods.

Core fields

- name(name: string) sets the extension name
- version(version: string) sets the version string
- description(desc: string) sets the extension description

Permissions

- permissions(...perms: string[]) appends API permissions like storage, tabs, scripting. Can be called multiple times and values accumulate.
- hostPermissions(...hosts: string[]) appends host match patterns. Accumulates across calls.

Background

- background(serviceWorker: string, type?: string) sets the background service worker path. Pass "module" as the second argument for ES module workers.

Content scripts

- contentScript(matches: string[], js?: string[], css?: string[], runAt?: string) adds one content script entry. Call multiple times for multiple content scripts. Each call appends to the content_scripts array.

Action

- action(popup?: string, icon?: Record<string, string>) configures the toolbar action with an optional popup HTML path and optional icon map.

Icons

- icons(icons: Record<string, string>) sets the extension icon map keyed by pixel size.

Options

- optionsPage(page: string) sets the options page HTML path.

Commands

- commands(cmds: Record<string, { description: string; suggested_key?: Record<string, string> }>) defines keyboard shortcuts.

```typescript
.commands({
  "toggle-feature": {
    description: "Toggle the main feature",
    suggested_key: { default: "Ctrl+Shift+F", mac: "Command+Shift+F" }
  }
})
```

Web accessible resources

- webAccessibleResources(resources: string[], matches: string[]) adds a web_accessible_resources entry. Accumulates across calls.

Escape hatch

- set(key: string, value: any) writes any arbitrary key into the manifest object. Useful for fields not covered by the typed API.

```typescript
.set("oauth2", {
  client_id: "your-client-id.apps.googleusercontent.com",
  scopes: ["https://www.googleapis.com/auth/drive"]
})
```

Validation and output

- validate() returns a string array of validation errors. Checks for required fields (name, version, manifest_version) and confirms manifest_version is 3. An empty array means the manifest is valid.
- build() returns a deep-cloned plain object of the manifest.
- toJSON(indent?: number) returns the manifest serialized as a JSON string. Defaults to 2-space indentation.

```typescript
const errors = builder.validate();
if (errors.length > 0) {
  console.error(errors);
  process.exit(1);
}

const json = builder.toJSON(2);
fs.writeFileSync("manifest.json", json);
```

LICENSE

MIT. See the LICENSE file for details.

ABOUT

chrome-manifest-builder is maintained by theluckystrike and built at zovo.one, a Chrome extension studio.

https://github.com/theluckystrike/chrome-manifest-builder
