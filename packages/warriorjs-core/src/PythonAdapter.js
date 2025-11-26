import vm from 'vm';

import filbert from 'filbert';
import escodegen from 'escodegen';

import LanguageAdapter from './LanguageAdapter';

const playerCodeTimeout = 3000;

/**
 * Language adapter for Python.
 *
 * Uses Filbert to transpile Python code to JavaScript, which is then
 * executed in the same VM as the JavaScript adapter. This avoids the
 * need for external Python processes or IPC.
 */
class PythonAdapter extends LanguageAdapter {
  /**
   * @inheritdoc
   */
  // eslint-disable-next-line class-methods-use-this
  getId() {
    return 'python';
  }

  /**
   * @inheritdoc
   */
  // eslint-disable-next-line class-methods-use-this
  getName() {
    return 'Python';
  }

  /**
   * @inheritdoc
   */
  // eslint-disable-next-line class-methods-use-this
  getFileExtension() {
    return '.py';
  }

  /**
   * @inheritdoc
   */
  // eslint-disable-next-line class-methods-use-this
  getTemplateFilename() {
    return 'Player.py';
  }

  /**
   * @inheritdoc
   */
  // eslint-disable-next-line class-methods-use-this
  loadPlayer(playerCode) {
    let jsCode;

    // Parse and transpile Python to JavaScript
    try {
      const ast = filbert.parse(playerCode);
      jsCode = escodegen.generate(ast);
    } catch (err) {
      const error = new Error(
        `Check your Python syntax and try again!\n\n${err.message}`,
      );
      error.code = 'InvalidPlayerCode';
      throw error;
    }

    // Wrap the transpiled code to extract the Player class
    // Filbert generates prototype-based classes, so we need to make Player accessible
    const wrappedCode = `
      (function() {
        ${jsCode}
        return Player;
      })()
    `;

    // Create a sandbox and run the transpiled code
    const sandbox = vm.createContext();

    // Do not collect stack frames for errors in the player code.
    vm.runInContext('Error.stackTraceLimit = 0;', sandbox);

    let PlayerClass;
    try {
      PlayerClass = vm.runInContext(wrappedCode, sandbox, {
        filename: this.getTemplateFilename(),
        timeout: playerCodeTimeout,
      });
    } catch (err) {
      // Check if it's a "Player is not defined" error
      // Note: instanceof check doesn't work for errors from VM context
      if (
        err.constructor.name === 'ReferenceError' &&
        err.message === 'Player is not defined'
      ) {
        const error = new Error('You must define a Player class!');
        error.code = 'InvalidPlayerCode';
        throw error;
      }
      const error = new Error(
        `Check your Python syntax and try again!\n\n${err.message || err}`,
      );
      error.code = 'InvalidPlayerCode';
      throw error;
    }

    // Check if Player class was defined
    if (!PlayerClass) {
      const error = new Error('You must define a Player class!');
      error.code = 'InvalidPlayerCode';
      throw error;
    }

    // Check if play_turn method exists
    if (typeof PlayerClass.prototype.play_turn !== 'function') {
      const error = new Error(
        'Your Player class must define a play_turn method!',
      );
      error.code = 'InvalidPlayerCode';
      throw error;
    }

    // Create an instance of the Player class
    const player = new PlayerClass();

    // Return the playTurn function
    const playTurn = warrior => {
      try {
        player.play_turn(warrior);
      } catch (err) {
        const error = new Error(err.message);
        error.code = 'InvalidPlayerCode';
        throw error;
      }
    };

    return playTurn;
  }
}

export default PythonAdapter;
