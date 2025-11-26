import getLevel from './getLevel';
import runLevel from './runLevel';
import getLevelConfig from '@warriorjs/helper-get-level-config';
import getLevelScore from '@warriorjs/helper-get-level-score';
import getGradeLetter from '@warriorjs/helper-get-grade-letter';
import BabyStepsTower from './towers/babySteps';

const STORAGE_KEY = 'warriorjs_profile';

/**
 * Browser-based game state manager for WarriorJS
 */
class GameState {
  constructor() {
    this.towers = [BabyStepsTower];
    this.profile = this.loadProfile();
  }

  /**
   * Load profile from localStorage
   */
  loadProfile() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.error('Failed to load profile:', e);
    }
    return null;
  }

  /**
   * Save profile to localStorage
   */
  saveProfile() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.profile));
    } catch (e) {
      console.error('Failed to save profile:', e);
    }
  }

  /**
   * Create a new profile
   */
  createProfile(warriorName, towerId) {
    const tower = this.towers.find(t => t.id === towerId);
    if (!tower) {
      throw new Error(`Tower '${towerId}' not found`);
    }
    
    this.profile = {
      warriorName,
      towerId,
      levelNumber: 1,
      score: 0,
      clue: false,
      epic: false,
      epicScore: 0,
      averageGrade: null,
    };
    this.saveProfile();
    return this.profile;
  }

  /**
   * Reset game state
   */
  resetProfile() {
    localStorage.removeItem(STORAGE_KEY);
    this.profile = null;
  }

  /**
   * Get available towers
   */
  getTowers() {
    return this.towers.map(t => ({
      id: t.id,
      name: t.name,
      description: t.description,
      levelCount: t.levels.length,
    }));
  }

  /**
   * Get current tower
   */
  getCurrentTower() {
    if (!this.profile) return null;
    return this.towers.find(t => t.id === this.profile.towerId);
  }

  /**
   * Get level config for current or specified level
   */
  getLevelConfig(levelNumber = null) {
    const tower = this.getCurrentTower();
    if (!tower) return null;
    
    const level = levelNumber || this.profile.levelNumber;
    return getLevelConfig(tower, level, this.profile.warriorName, this.profile.epic);
  }

  /**
   * Get level info for display (without running it)
   */
  getLevelInfo(levelNumber = null) {
    const levelConfig = this.getLevelConfig(levelNumber);
    if (!levelConfig) return null;
    
    return getLevel(levelConfig);
  }

  /**
   * Run level with player code
   */
  runLevel(playerCode) {
    const levelConfig = this.getLevelConfig();
    if (!levelConfig) {
      throw new Error('No level config available');
    }

    const levelResult = runLevel(levelConfig, playerCode);
    
    // Calculate score
    const scoreParts = getLevelScore(levelResult, levelConfig);
    const totalScore = Object.values(scoreParts).reduce((sum, value) => sum + value, 0);
    const grade = (totalScore * 1.0) / levelConfig.aceScore;
    
    return {
      ...levelResult,
      levelConfig,
      scoreParts,
      totalScore,
      grade,
      gradeLetter: getGradeLetter(grade),
      hasNextLevel: this.hasNextLevel(),
    };
  }

  /**
   * Check if there's a next level
   */
  hasNextLevel() {
    const tower = this.getCurrentTower();
    if (!tower) return false;
    return this.profile.levelNumber < tower.levels.length;
  }

  /**
   * Advance to next level
   */
  advanceLevel(totalScore) {
    if (!this.profile.epic) {
      this.profile.score += totalScore;
    }
    this.profile.levelNumber += 1;
    this.profile.clue = false;
    this.saveProfile();
    return this.profile;
  }

  /**
   * Enable epic mode
   */
  enableEpicMode() {
    this.profile.epic = true;
    this.saveProfile();
    return this.profile;
  }

  /**
   * Request clue for current level
   */
  requestClue() {
    this.profile.clue = true;
    this.saveProfile();
    return this.getLevelConfig()?.clue || null;
  }

  /**
   * Check if clue is available
   */
  isClueAvailable() {
    const levelConfig = this.getLevelConfig();
    return levelConfig?.clue && !this.profile.clue;
  }

  /**
   * Get clue if requested
   */
  getClue() {
    if (this.profile.clue) {
      return this.getLevelConfig()?.clue || null;
    }
    return null;
  }
}

export default GameState;
