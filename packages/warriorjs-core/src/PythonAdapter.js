import LanguageAdapter from './LanguageAdapter';

/**
 * Language adapter for Python.
 *
 * This is a placeholder implementation that demonstrates the structure.
 * A full implementation would require:
 * 1. A Python bridge/wrapper to execute player code
 * 2. Inter-process communication between Node.js and Python
 * 3. Serialization of the warrior API state
 * 4. Deserialization of player actions
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
  // eslint-disable-next-line class-methods-use-this, no-unused-vars
  loadPlayer(playerCode) {
    // TODO: Implement Python code execution
    // For now, throw a not implemented error with helpful message
    const error = new Error(
      'Python support is not yet fully implemented. This adapter provides the structure for future implementation.\n\n' +
        'To implement Python support:\n' +
        '1. Create a Python wrapper that bridges the warrior API\n' +
        '2. Set up inter-process communication (e.g., via stdin/stdout or sockets)\n' +
        '3. Serialize warrior state to JSON and send to Python process\n' +
        '4. Deserialize actions from Python and execute on warrior object\n' +
        '5. Handle errors and timeouts appropriately',
    );
    error.code = 'NotImplemented';
    throw error;
  }
}

export default PythonAdapter;
