import languageRegistry from './LanguageRegistry';

/**
 * Loads the player code and returns the playTurn function.
 *
 * @param {string} playerCode The code of the player.
 * @param {string} languageId The language ID (default: 'javascript').
 *
 * @returns {Function} The playTurn function.
 */
function loadPlayer(playerCode, languageId = 'javascript') {
  const adapter = languageRegistry.get(languageId);

  if (!adapter) {
    throw new Error(`Unknown language: ${languageId}`);
  }

  return adapter.loadPlayer(playerCode);
}

export default loadPlayer;
