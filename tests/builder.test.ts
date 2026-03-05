import { describe, it, expect } from 'vitest';
import { ManifestBuilder } from '../src/builder';

describe('ManifestBuilder', () => {
  describe('basic setters', () => {
    it('should set name', () => {
      const builder = new ManifestBuilder();
      const manifest = builder.name('My Extension').build();
      expect(manifest.name).toBe('My Extension');
    });

    it('should set version', () => {
      const builder = new ManifestBuilder();
      const manifest = builder.version('1.0.0').build();
      expect(manifest.version).toBe('1.0.0');
    });

    it('should set description', () => {
      const builder = new ManifestBuilder();
      const manifest = builder.description('A test extension').build();
      expect(manifest.description).toBe('A test extension');
    });

    it('should chain methods', () => {
      const builder = new ManifestBuilder();
      const manifest = builder
        .name('My Extension')
        .version('1.0.0')
        .description('Test description')
        .build();
      expect(manifest.name).toBe('My Extension');
      expect(manifest.version).toBe('1.0.0');
      expect(manifest.description).toBe('Test description');
    });
  });

  describe('permissions', () => {
    it('should add permissions', () => {
      const builder = new ManifestBuilder();
      const manifest = builder.permissions('storage', 'tabs').build();
      expect(manifest.permissions).toEqual(['storage', 'tabs']);
    });

    it('should accumulate permissions', () => {
      const builder = new ManifestBuilder();
      const manifest = builder.permissions('storage').permissions('tabs', 'cookies').build();
      expect(manifest.permissions).toEqual(['storage', 'tabs', 'cookies']);
    });
  });

  describe('hostPermissions', () => {
    it('should add host permissions', () => {
      const builder = new ManifestBuilder();
      const manifest = builder.hostPermissions('https://example.com/*').build();
      expect(manifest.host_permissions).toEqual(['https://example.com/*']);
    });

    it('should accumulate host permissions', () => {
      const builder = new ManifestBuilder();
      const manifest = builder
        .hostPermissions('https://example.com/*')
        .hostPermissions('https://api.example.com/*')
        .build();
      expect(manifest.host_permissions).toEqual(['https://example.com/*', 'https://api.example.com/*']);
    });
  });

  describe('background', () => {
    it('should set background service worker', () => {
      const builder = new ManifestBuilder();
      const manifest = builder.background('background.js').build();
      expect(manifest.background).toEqual({ service_worker: 'background.js' });
    });

    it('should set background with type', () => {
      const builder = new ManifestBuilder();
      const manifest = builder.background('background.js', 'module').build();
      expect(manifest.background).toEqual({ service_worker: 'background.js', type: 'module' });
    });
  });

  describe('contentScript', () => {
    it('should add content script with matches and js', () => {
      const builder = new ManifestBuilder();
      const manifest = builder.contentScript(['<all_urls>'], ['content.js']).build();
      expect(manifest.content_scripts).toEqual([{
        matches: ['<all_urls>'],
        js: ['content.js']
      }]);
    });

    it('should add content script with all options', () => {
      const builder = new ManifestBuilder();
      const manifest = builder.contentScript(
        ['<all_urls>'],
        ['content.js'],
        ['styles.css'],
        'document_end'
      ).build();
      expect(manifest.content_scripts).toEqual([{
        matches: ['<all_urls>'],
        js: ['content.js'],
        css: ['styles.css'],
        run_at: 'document_end'
      }]);
    });

    it('should accumulate multiple content scripts', () => {
      const builder = new ManifestBuilder();
      const manifest = builder
        .contentScript(['<all_urls>'], ['content.js'])
        .contentScript(['https://example.com/*'], ['other.js'])
        .build();
      expect(manifest.content_scripts).toHaveLength(2);
    });
  });

  describe('action', () => {
    it('should set action with popup', () => {
      const builder = new ManifestBuilder();
      const manifest = builder.action('popup.html').build();
      expect(manifest.action).toEqual({ default_popup: 'popup.html' });
    });

    it('should set action with popup and icon', () => {
      const builder = new ManifestBuilder();
      const manifest = builder.action('popup.html', { '16': 'icon16.png' }).build();
      expect(manifest.action).toEqual({
        default_popup: 'popup.html',
        default_icon: { '16': 'icon16.png' }
      });
    });

    it('should set action with only icon', () => {
      const builder = new ManifestBuilder();
      const manifest = builder.action(undefined, { '16': 'icon16.png' }).build();
      expect(manifest.action).toEqual({ default_icon: { '16': 'icon16.png' } });
    });
  });

  describe('icons', () => {
    it('should set icons', () => {
      const builder = new ManifestBuilder();
      const manifest = builder.icons({ '16': 'icon16.png', '48': 'icon48.png' }).build();
      expect(manifest.icons).toEqual({ '16': 'icon16.png', '48': 'icon48.png' });
    });
  });

  describe('optionsPage', () => {
    it('should set options page', () => {
      const builder = new ManifestBuilder();
      const manifest = builder.optionsPage('options.html').build();
      expect(manifest.options_page).toBe('options.html');
    });
  });

  describe('commands', () => {
    it('should set commands', () => {
      const builder = new ManifestBuilder();
      const manifest = builder.commands({
        'toggle-feature': { suggested_key: { default: 'Ctrl+Shift+1' }, description: 'Toggle feature' }
      }).build();
      expect(manifest.commands).toEqual({
        'toggle-feature': { suggested_key: { default: 'Ctrl+Shift+1' }, description: 'Toggle feature' }
      });
    });
  });

  describe('webAccessibleResources', () => {
    it('should set web accessible resources', () => {
      const builder = new ManifestBuilder();
      const manifest = builder.webAccessibleResources(['images/*'], ['<all_urls>']).build();
      expect(manifest.web_accessible_resources).toEqual([{
        resources: ['images/*'],
        matches: ['<all_urls>']
      }]);
    });

    it('should accumulate web accessible resources', () => {
      const builder = new ManifestBuilder();
      const manifest = builder
        .webAccessibleResources(['images/*'], ['<all_urls>'])
        .webAccessibleResources(['fonts/*'], ['https://example.com/*'])
        .build();
      expect(manifest.web_accessible_resources).toHaveLength(2);
    });
  });

  describe('set', () => {
    it('should set arbitrary key-value', () => {
      const builder = new ManifestBuilder();
      const manifest = builder.set('customField', 'customValue').build();
      expect(manifest.customField).toBe('customValue');
    });
  });

  describe('validate', () => {
    it('should return error for missing name', () => {
      const builder = new ManifestBuilder();
      const errors = builder.version('1.0.0').validate();
      expect(errors).toContain('Missing required field: name');
    });

    it('should return error for missing version', () => {
      const builder = new ManifestBuilder();
      const errors = builder.name('My Extension').validate();
      expect(errors).toContain('Missing required field: version');
    });

    it('should return error for wrong manifest_version', () => {
      const builder = new ManifestBuilder();
      builder.set('manifest_version', 2);
      const errors = builder.name('Test').version('1.0.0').validate();
      expect(errors).toContain('manifest_version should be 3');
    });

    it('should return empty array for valid manifest', () => {
      const builder = new ManifestBuilder();
      const errors = builder.name('My Extension').version('1.0.0').validate();
      expect(errors).toEqual([]);
    });
  });

  describe('build', () => {
    it('should return deep copy of manifest', () => {
      const builder = new ManifestBuilder();
      const manifest = builder.name('Test').build();
      manifest.name = 'Modified';
      const manifest2 = builder.build();
      expect(manifest2.name).toBe('Test');
    });

    it('should include manifest_version by default', () => {
      const builder = new ManifestBuilder();
      const manifest = builder.build();
      expect(manifest.manifest_version).toBe(3);
    });
  });

  describe('toJSON', () => {
    it('should return JSON string with default indent', () => {
      const builder = new ManifestBuilder();
      builder.name('Test').version('1.0.0');
      const json = builder.toJSON();
      const parsed = JSON.parse(json);
      expect(parsed.name).toBe('Test');
      expect(parsed.version).toBe('1.0.0');
    });

    it('should return JSON string with custom indent', () => {
      const builder = new ManifestBuilder();
      builder.name('Test');
      const json = builder.toJSON(4);
      expect(json).toContain('"name": "Test"');
    });
  });

  describe('edge cases', () => {
    it('should handle empty permissions', () => {
      const builder = new ManifestBuilder();
      const manifest = builder.permissions().build();
      expect(manifest.permissions).toEqual([]);
    });

    it('should handle empty content script', () => {
      const builder = new ManifestBuilder();
      const manifest = builder.contentScript([]).build();
      expect(manifest.content_scripts).toEqual([{ matches: [] }]);
    });

    it('should handle empty web accessible resources', () => {
      const builder = new ManifestBuilder();
      const manifest = builder.webAccessibleResources([], []).build();
      expect(manifest.web_accessible_resources).toEqual([{ resources: [], matches: [] }]);
    });

    it('should handle null/undefined values gracefully', () => {
      const builder = new ManifestBuilder();
      const manifest = builder
        .name(undefined as any)
        .version(null as any)
        .build();
      // The builder should still work even with null/undefined
      expect(manifest).toBeDefined();
    });
  });
});
