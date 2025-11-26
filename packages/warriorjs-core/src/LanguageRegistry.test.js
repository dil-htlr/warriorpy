import languageRegistry from './LanguageRegistry';

describe('LanguageRegistry', () => {
  describe('get', () => {
    test('returns JavaScript adapter', () => {
      const adapter = languageRegistry.get('javascript');
      expect(adapter).toBeDefined();
      expect(adapter.getId()).toBe('javascript');
    });

    test('returns Python adapter', () => {
      const adapter = languageRegistry.get('python');
      expect(adapter).toBeDefined();
      expect(adapter.getId()).toBe('python');
    });

    test('returns C# adapter', () => {
      const adapter = languageRegistry.get('csharp');
      expect(adapter).toBeDefined();
      expect(adapter.getId()).toBe('csharp');
    });

    test('returns undefined for unknown language', () => {
      const adapter = languageRegistry.get('unknown');
      expect(adapter).toBeUndefined();
    });
  });

  describe('getAll', () => {
    test('returns all registered adapters', () => {
      const adapters = languageRegistry.getAll();
      expect(adapters.length).toBeGreaterThanOrEqual(3);
      const ids = adapters.map(a => a.getId());
      expect(ids).toContain('javascript');
      expect(ids).toContain('python');
      expect(ids).toContain('csharp');
    });
  });

  describe('has', () => {
    test('returns true for registered language', () => {
      expect(languageRegistry.has('javascript')).toBe(true);
      expect(languageRegistry.has('python')).toBe(true);
      expect(languageRegistry.has('csharp')).toBe(true);
    });

    test('returns false for unregistered language', () => {
      expect(languageRegistry.has('ruby')).toBe(false);
    });
  });

  describe('getDefault', () => {
    test('returns JavaScript adapter', () => {
      const adapter = languageRegistry.getDefault();
      expect(adapter.getId()).toBe('javascript');
    });
  });
});
