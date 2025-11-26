import LanguageAdapter from './LanguageAdapter';

describe('LanguageAdapter', () => {
  let adapter;

  beforeEach(() => {
    adapter = new LanguageAdapter();
  });

  describe('getId', () => {
    test('throws error when not implemented', () => {
      expect(() => adapter.getId()).toThrow(
        'getId() must be implemented by subclass',
      );
    });
  });

  describe('getName', () => {
    test('throws error when not implemented', () => {
      expect(() => adapter.getName()).toThrow(
        'getName() must be implemented by subclass',
      );
    });
  });

  describe('getFileExtension', () => {
    test('throws error when not implemented', () => {
      expect(() => adapter.getFileExtension()).toThrow(
        'getFileExtension() must be implemented by subclass',
      );
    });
  });

  describe('getTemplateFilename', () => {
    test('throws error when not implemented', () => {
      expect(() => adapter.getTemplateFilename()).toThrow(
        'getTemplateFilename() must be implemented by subclass',
      );
    });
  });

  describe('loadPlayer', () => {
    test('throws error when not implemented', () => {
      expect(() => adapter.loadPlayer('code')).toThrow(
        'loadPlayer() must be implemented by subclass',
      );
    });
  });

  describe('toString', () => {
    test('returns the language name', () => {
      const mockAdapter = new LanguageAdapter();
      mockAdapter.getName = jest.fn(() => 'TestLanguage');
      expect(mockAdapter.toString()).toBe('TestLanguage');
    });
  });
});
