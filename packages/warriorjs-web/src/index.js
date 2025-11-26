// WarriorJS Web - Browser-based game
import GameState from './GameState';
import getLevel from './getLevel';
import runLevel from './runLevel';
import '../public/styles.css';

// Export for module users
export { GameState, getLevel, runLevel };

// Global game instance for the browser UI
let gameState = null;
let currentCode = '';

/**
 * Initialize the game UI
 */
function initUI() {
  gameState = new GameState();
  
  // Check if profile exists
  if (gameState.profile) {
    showGameScreen();
  } else {
    showWelcomeScreen();
  }
}

/**
 * Show welcome screen for new players
 */
function showWelcomeScreen() {
  const app = document.getElementById('app');
  const towers = gameState.getTowers();
  
  app.innerHTML = `
    <div class="welcome-screen">
      <div class="logo">
        <h1>⚔️ WarriorJS</h1>
        <p class="tagline">An exciting game of programming and Artificial Intelligence</p>
      </div>
      
      <div class="setup-form">
        <h2>Create Your Warrior</h2>
        
        <div class="form-group">
          <label for="warrior-name">Warrior Name</label>
          <input type="text" id="warrior-name" placeholder="Enter your warrior's name" maxlength="20">
        </div>
        
        <div class="form-group">
          <label for="tower-select">Select Tower</label>
          <select id="tower-select">
            ${towers.map(t => `<option value="${t.id}">${t.name} - ${t.description} (${t.levelCount} levels)</option>`).join('')}
          </select>
        </div>
        
        <button id="start-game" class="btn primary">Begin Journey</button>
      </div>
    </div>
  `;
  
  document.getElementById('start-game').addEventListener('click', createProfile);
}

/**
 * Create player profile
 */
function createProfile() {
  const name = document.getElementById('warrior-name').value.trim();
  const towerId = document.getElementById('tower-select').value;
  
  if (!name) {
    alert('Please enter a name for your warrior!');
    return;
  }
  
  try {
    gameState.createProfile(name, towerId);
    showGameScreen();
  } catch (e) {
    alert('Error creating profile: ' + e.message);
  }
}

/**
 * Show main game screen
 */
function showGameScreen() {
  const app = document.getElementById('app');
  const levelInfo = gameState.getLevelInfo();
  const profile = gameState.profile;
  const tower = gameState.getCurrentTower();
  
  // Default player code template
  const defaultCode = `class Player {
  playTurn(warrior) {
    // Add your code here!
    // Available abilities: ${levelInfo.warriorAbilities.actions.map(a => a.name).concat(levelInfo.warriorAbilities.senses.map(s => s.name)).join(', ')}
    
  }
}`;

  currentCode = localStorage.getItem('warriorjs_code_' + profile.levelNumber) || defaultCode;
  
  app.innerHTML = `
    <div class="game-screen">
      <header class="game-header">
        <div class="header-left">
          <h1>⚔️ WarriorJS</h1>
          <span class="warrior-info">${profile.warriorName} - ${tower.name}</span>
        </div>
        <div class="header-right">
          <span class="level-info">Level ${profile.levelNumber}</span>
          <span class="score-info">Score: ${profile.score}</span>
          <button id="reset-game" class="btn danger small">Reset</button>
        </div>
      </header>
      
      <div class="game-content">
        <aside class="level-panel">
          <div class="level-header">
            <h2>Level ${levelInfo.number}</h2>
          </div>
          
          <div class="level-description">
            <p>${levelInfo.description}</p>
          </div>
          
          <div class="level-tip">
            <h3>💡 Tip</h3>
            <p>${levelInfo.tip}</p>
          </div>
          
          ${levelInfo.clue && profile.clue ? `
          <div class="level-clue">
            <h3>🔑 Clue</h3>
            <p>${levelInfo.clue}</p>
          </div>
          ` : ''}
          
          ${levelInfo.clue && !profile.clue ? `
          <button id="show-clue" class="btn secondary">Show Clue</button>
          ` : ''}
          
          <div class="abilities-section">
            <h3>Available Actions</h3>
            <ul class="ability-list">
              ${levelInfo.warriorAbilities.actions.map(a => `
                <li><code>warrior.${a.name}()</code><br><small>${a.description}</small></li>
              `).join('')}
            </ul>
            
            <h3>Available Senses</h3>
            <ul class="ability-list">
              ${levelInfo.warriorAbilities.senses.map(s => `
                <li><code>warrior.${s.name}()</code><br><small>${s.description}</small></li>
              `).join('')}
            </ul>
          </div>
          
          <div class="floor-preview">
            <h3>Floor Map</h3>
            <pre class="floor-map">${renderFloorMap(levelInfo.floorMap)}</pre>
            <div class="warrior-status">
              Health: ${levelInfo.warriorStatus.health} HP
            </div>
          </div>
        </aside>
        
        <main class="code-panel">
          <div class="code-header">
            <h3>Player.js</h3>
            <div class="code-actions">
              <button id="run-code" class="btn primary">▶ Run</button>
            </div>
          </div>
          
          <div class="code-editor-container">
            <textarea id="code-editor" spellcheck="false">${escapeHtml(currentCode)}</textarea>
          </div>
          
          <div class="output-panel">
            <h3>Game Output</h3>
            <div id="game-output" class="output-content">
              <p class="placeholder">Click "Run" to execute your code...</p>
            </div>
          </div>
        </main>
      </div>
    </div>
  `;
  
  // Event listeners
  document.getElementById('run-code').addEventListener('click', runGame);
  document.getElementById('reset-game').addEventListener('click', resetGame);
  
  const clueBtn = document.getElementById('show-clue');
  if (clueBtn) {
    clueBtn.addEventListener('click', showClue);
  }
  
  // Save code on change
  document.getElementById('code-editor').addEventListener('input', (e) => {
    currentCode = e.target.value;
    localStorage.setItem('warriorjs_code_' + profile.levelNumber, currentCode);
  });
}

/**
 * Render floor map as text
 */
function renderFloorMap(floorMap) {
  return floorMap.map(row => 
    row.map(space => space.character).join('')
  ).join('\n');
}

/**
 * Escape HTML for safe display
 */
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

/**
 * Run the game with current code
 */
function runGame() {
  const code = document.getElementById('code-editor').value;
  const output = document.getElementById('game-output');
  
  output.innerHTML = '<p>Running...</p>';
  
  try {
    const result = gameState.runLevel(code);
    displayResult(result);
  } catch (e) {
    output.innerHTML = `<div class="error">
      <h4>Error</h4>
      <pre>${escapeHtml(e.message)}</pre>
    </div>`;
  }
}

/**
 * Display game result
 */
function displayResult(result) {
  const output = document.getElementById('game-output');
  
  let html = '<div class="game-log">';
  
  // Display each turn
  result.events.forEach((turn, turnIndex) => {
    html += `<div class="turn-log"><h4>Turn ${turnIndex + 1}</h4>`;
    turn.forEach(event => {
      html += `<div class="event">
        <span class="unit-name" style="color: ${event.unit.color}">${event.unit.name}</span>
        <span class="message">${escapeHtml(event.message)}</span>
      </div>`;
      html += `<pre class="floor-snapshot">${renderFloorMap(event.floorMap)}</pre>`;
    });
    html += '</div>';
  });
  
  html += '</div>';
  
  // Show result
  if (result.passed) {
    html += `<div class="result success">
      <h3>🎉 Success!</h3>
      <p>You passed Level ${result.levelConfig.number}!</p>
      <div class="score-breakdown">
        <p>Warrior Score: ${result.scoreParts.warrior}</p>
        <p>Time Bonus: ${result.scoreParts.timeBonus}</p>
        <p>Clear Bonus: ${result.scoreParts.clearBonus}</p>
        <p><strong>Total: ${result.totalScore} points (Grade: ${result.gradeLetter})</strong></p>
      </div>
      ${result.hasNextLevel ? 
        '<button id="next-level" class="btn primary">Continue to Next Level</button>' :
        '<button id="epic-mode" class="btn primary">Enter Epic Mode!</button>'
      }
    </div>`;
  } else {
    html += `<div class="result failure">
      <h3>💀 Failed</h3>
      <p>Your warrior didn't make it. Modify your code and try again!</p>
    </div>`;
  }
  
  output.innerHTML = html;
  
  // Add event listeners for result buttons
  const nextBtn = document.getElementById('next-level');
  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      gameState.advanceLevel(result.totalScore);
      showGameScreen();
    });
  }
  
  const epicBtn = document.getElementById('epic-mode');
  if (epicBtn) {
    epicBtn.addEventListener('click', () => {
      gameState.enableEpicMode();
      alert('Epic Mode enabled! You can now replay all levels with all abilities.');
      showGameScreen();
    });
  }
}

/**
 * Show clue for current level
 */
function showClue() {
  gameState.requestClue();
  showGameScreen();
}

/**
 * Reset game progress
 */
function resetGame() {
  if (confirm('Are you sure you want to reset all progress?')) {
    gameState.resetProfile();
    // Clear all saved code
    for (let i = 1; i <= 20; i++) {
      localStorage.removeItem('warriorjs_code_' + i);
    }
    showWelcomeScreen();
  }
}

// Initialize when DOM is ready
if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initUI);
  } else {
    initUI();
  }
}
