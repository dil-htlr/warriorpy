/**
 * Loads the player code and returns the playTurn function.
 * Browser-compatible version using Function constructor instead of Node.js vm.
 *
 * Security Note: This uses the Function constructor to execute player-provided code.
 * This is intentional for a programming game where players write their own code.
 * The code runs only in the player's own browser with no server-side execution.
 * The game API (warrior object) only exposes safe game actions.
 *
 * @param {string} playerCode The code of the player.
 *
 * @returns {Function} The playTurn function.
 */
function loadPlayer(playerCode) {
  // Wrap the player code to execute in a function scope
  const wrappedCode = `
    ${playerCode}
    return typeof Player !== 'undefined' ? new Player() : null;
  `;

  let player;
  try {
    // Use Function constructor as a safer alternative to eval
    // eslint-disable-next-line no-new-func
    const createPlayer = new Function(wrappedCode);
    player = createPlayer();
  } catch (err) {
    const error = new Error(`Check your syntax and try again!\n\n${err.message}`);
    error.code = 'InvalidPlayerCode';
    throw error;
  }

  if (!player) {
    const error = new Error('You must define a Player class!');
    error.code = 'InvalidPlayerCode';
    throw error;
  }

  if (typeof player.playTurn !== 'function') {
    const error = new Error('Your Player class must define a playTurn method!');
    error.code = 'InvalidPlayerCode';
    throw error;
  }

  const playTurn = turn => {
    try {
      player.playTurn(turn);
    } catch (err) {
      const error = new Error(err.message);
      error.code = 'InvalidPlayerCode';
      throw error;
    }
  };

  return playTurn;
}

export default loadPlayer;
