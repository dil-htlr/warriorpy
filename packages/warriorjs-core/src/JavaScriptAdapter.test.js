import JavaScriptAdapter from './JavaScriptAdapter';

describe('JavaScriptAdapter', () => {
  let adapter;

  beforeEach(() => {
    adapter = new JavaScriptAdapter();
  });

  describe('getId', () => {
    test('returns javascript', () => {
      expect(adapter.getId()).toBe('javascript');
    });
  });

  describe('getName', () => {
    test('returns JavaScript', () => {
      expect(adapter.getName()).toBe('JavaScript');
    });
  });

  describe('getFileExtension', () => {
    test('returns .js', () => {
      expect(adapter.getFileExtension()).toBe('.js');
    });
  });

  describe('getTemplateFilename', () => {
    test('returns Player.js', () => {
      expect(adapter.getTemplateFilename()).toBe('Player.js');
    });
  });

  describe('loadPlayer', () => {
    test('loads valid player code', () => {
      const playerCode = `
        class Player {
          playTurn(warrior) {
            warrior.walk();
          }
        }
      `;
      const playTurn = adapter.loadPlayer(playerCode);
      expect(typeof playTurn).toBe('function');
    });

    test('throws error for invalid syntax', () => {
      const playerCode = 'this is not valid javascript {{{';
      expect(() => adapter.loadPlayer(playerCode)).toThrow(
        'Check your syntax and try again!',
      );
    });

    test('throws error when Player class is not defined', () => {
      const playerCode = 'const foo = 123;';
      expect(() => adapter.loadPlayer(playerCode)).toThrow(
        'You must define a Player class!',
      );
    });

    test('throws error when playTurn method is not defined', () => {
      const playerCode = `
        class Player {
          constructor() {}
        }
      `;
      expect(() => adapter.loadPlayer(playerCode)).toThrow(
        'Your Player class must define a playTurn method!',
      );
    });

    test('executes playTurn on warrior', () => {
      const playerCode = `
        class Player {
          playTurn(warrior) {
            warrior.walk();
          }
        }
      `;
      const playTurn = adapter.loadPlayer(playerCode);
      const warrior = { walk: jest.fn() };
      playTurn(warrior);
      expect(warrior.walk).toHaveBeenCalled();
    });
  });
});
