/**
 * Base class for language adapters.
 *
 * Each language adapter is responsible for:
 * - Loading and executing player code in that language
 * - Validating player code syntax
 * - Providing the playTurn function interface
 */
class LanguageAdapter {
  /**
   * Returns the unique identifier for this language.
   *
   * @returns {string} The language ID (e.g., 'javascript', 'python', 'csharp')
   */
  // eslint-disable-next-line class-methods-use-this
  getId() {
    throw new Error('getId() must be implemented by subclass');
  }

  /**
   * Returns the display name for this language.
   *
   * @returns {string} The language display name (e.g., 'JavaScript', 'Python', 'C#')
   */
  // eslint-disable-next-line class-methods-use-this
  getName() {
    throw new Error('getName() must be implemented by subclass');
  }

  /**
   * Returns the file extension for player code files.
   *
   * @returns {string} The file extension (e.g., '.js', '.py', '.cs')
   */
  // eslint-disable-next-line class-methods-use-this
  getFileExtension() {
    throw new Error('getFileExtension() must be implemented by subclass');
  }

  /**
   * Returns the template filename for this language.
   *
   * @returns {string} The template filename (e.g., 'Player.js', 'Player.py')
   */
  // eslint-disable-next-line class-methods-use-this
  getTemplateFilename() {
    throw new Error('getTemplateFilename() must be implemented by subclass');
  }

  /**
   * Loads the player code and returns the playTurn function.
   *
   * @param {string} playerCode The code of the player.
   *
   * @returns {Function} The playTurn function.
   */
  // eslint-disable-next-line class-methods-use-this, no-unused-vars
  loadPlayer(playerCode) {
    throw new Error('loadPlayer() must be implemented by subclass');
  }

  /**
   * Returns the string representation of this language adapter.
   *
   * @returns {string} The string representation.
   */
  toString() {
    return this.getName();
  }
}

export default LanguageAdapter;
