import PythonAdapter from './PythonAdapter';

describe('PythonAdapter', () => {
  let adapter;

  beforeEach(() => {
    adapter = new PythonAdapter();
  });

  describe('getId', () => {
    test('returns python', () => {
      expect(adapter.getId()).toBe('python');
    });
  });

  describe('getName', () => {
    test('returns Python', () => {
      expect(adapter.getName()).toBe('Python');
    });
  });

  describe('getFileExtension', () => {
    test('returns .py', () => {
      expect(adapter.getFileExtension()).toBe('.py');
    });
  });

  describe('getTemplateFilename', () => {
    test('returns Player.py', () => {
      expect(adapter.getTemplateFilename()).toBe('Player.py');
    });
  });

  describe('loadPlayer', () => {
    test('loads valid Python player code', () => {
      const playerCode = `
class Player:
    def play_turn(self, warrior):
        warrior.walk()
`;
      const playTurn = adapter.loadPlayer(playerCode);
      expect(typeof playTurn).toBe('function');
    });

    test('throws error for invalid syntax', () => {
      const playerCode = 'this is not valid python {{{';
      expect(() => adapter.loadPlayer(playerCode)).toThrow(
        'Check your Python syntax and try again!',
      );
    });

    test('throws error when Player class is not defined', () => {
      const playerCode = 'foo = 123';
      expect(() => adapter.loadPlayer(playerCode)).toThrow(
        'You must define a Player class!',
      );
    });

    test('throws error when play_turn method is not defined', () => {
      const playerCode = `
class Player:
    def __init__(self):
        pass
`;
      expect(() => adapter.loadPlayer(playerCode)).toThrow(
        'Your Player class must define a play_turn method!',
      );
    });

    test('executes play_turn on warrior', () => {
      const playerCode = `
class Player:
    def play_turn(self, warrior):
        warrior.walk()
`;
      const playTurn = adapter.loadPlayer(playerCode);
      const warrior = { walk: jest.fn() };
      playTurn(warrior);
      expect(warrior.walk).toHaveBeenCalled();
    });

    test('warrior can attack', () => {
      const playerCode = `
class Player:
    def play_turn(self, warrior):
        warrior.attack()
`;
      const playTurn = adapter.loadPlayer(playerCode);
      const warrior = { attack: jest.fn() };
      playTurn(warrior);
      expect(warrior.attack).toHaveBeenCalled();
    });

    test('warrior can rest', () => {
      const playerCode = `
class Player:
    def play_turn(self, warrior):
        warrior.rest()
`;
      const playTurn = adapter.loadPlayer(playerCode);
      const warrior = { rest: jest.fn() };
      playTurn(warrior);
      expect(warrior.rest).toHaveBeenCalled();
    });

    test('warrior can use direction parameter', () => {
      const playerCode = `
class Player:
    def play_turn(self, warrior):
        warrior.walk('backward')
`;
      const playTurn = adapter.loadPlayer(playerCode);
      const warrior = { walk: jest.fn() };
      playTurn(warrior);
      expect(warrior.walk).toHaveBeenCalledWith('backward');
    });
  });
});
