/**
 * Manifest Builder — Programmatic MV3 manifest.json generation
 */
export class ManifestBuilder {
    private manifest: Record<string, any> = { manifest_version: 3 };

    name(name: string): this { this.manifest.name = name; return this; }
    version(version: string): this { this.manifest.version = version; return this; }
    description(desc: string): this { this.manifest.description = desc; return this; }

    permissions(...perms: string[]): this {
        this.manifest.permissions = [...(this.manifest.permissions || []), ...perms];
        return this;
    }

    hostPermissions(...hosts: string[]): this {
        this.manifest.host_permissions = [...(this.manifest.host_permissions || []), ...hosts];
        return this;
    }

    background(serviceWorker: string, type?: string): this {
        this.manifest.background = { service_worker: serviceWorker, ...(type ? { type } : {}) };
        return this;
    }

    contentScript(matches: string[], js?: string[], css?: string[], runAt?: string): this {
        this.manifest.content_scripts = [...(this.manifest.content_scripts || []),
        { matches, ...(js ? { js } : {}), ...(css ? { css } : {}), ...(runAt ? { run_at: runAt } : {}) }];
        return this;
    }

    action(popup?: string, icon?: Record<string, string>): this {
        this.manifest.action = { ...(popup ? { default_popup: popup } : {}), ...(icon ? { default_icon: icon } : {}) };
        return this;
    }

    icons(icons: Record<string, string>): this { this.manifest.icons = icons; return this; }

    optionsPage(page: string): this { this.manifest.options_page = page; return this; }

    commands(cmds: Record<string, { suggested_key?: Record<string, string>; description: string }>): this {
        this.manifest.commands = cmds; return this;
    }

    webAccessibleResources(resources: string[], matches: string[]): this {
        this.manifest.web_accessible_resources = [...(this.manifest.web_accessible_resources || []), { resources, matches }];
        return this;
    }

    set(key: string, value: any): this { this.manifest[key] = value; return this; }

    validate(): string[] {
        const errors: string[] = [];
        if (!this.manifest.name) errors.push('Missing required field: name');
        if (!this.manifest.version) errors.push('Missing required field: version');
        if (!this.manifest.manifest_version) errors.push('Missing required field: manifest_version');
        if (this.manifest.manifest_version !== 3) errors.push('manifest_version should be 3');
        return errors;
    }

    build(): Record<string, any> { return JSON.parse(JSON.stringify(this.manifest)); }

    toJSON(indent: number = 2): string { return JSON.stringify(this.manifest, null, indent); }
}
