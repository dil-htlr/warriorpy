import loadLevel from './loadLevel';

/**
 * Runs the given level config.
 *
 * @param {Object} levelConfig The config of the level.
 * @param {string} playerCode The code of the player.
 * @param {string} [languageId] The language ID (default: 'javascript').
 *
 * @returns {Object} The result of the level.
 */
function runLevel(levelConfig, playerCode, languageId = 'javascript') {
  const level = loadLevel(levelConfig, playerCode, languageId);
  return level.play();
}

export default runLevel;
