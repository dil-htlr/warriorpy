import fs from 'fs';
import path from 'path';

import ejs from 'ejs';
import { languageRegistry } from '@warriorjs/core';

import getFloorMap from './utils/getFloorMap';
import getFloorMapKey from './utils/getFloorMapKey';

const templatesPath = path.resolve(__dirname, '..', 'templates');
export const README_TEMPLATE_FILE_PATH = path.join(
  templatesPath,
  'README.md.ejs',
);

/**
 * Gets the player code template file path for a given language.
 *
 * @param {string} languageId The language ID.
 *
 * @returns {string} The path to the template file.
 */
export function getPlayerCodeTemplateFilePath(languageId) {
  const adapter = languageRegistry.get(languageId);
  if (!adapter) {
    throw new Error(`Unknown language: ${languageId}`);
  }
  return path.join(templatesPath, adapter.getTemplateFilename());
}

/** Class representing a profile generator. */
class ProfileGenerator {
  /**
   * Creates a profile generator.
   *
   * @param {Profile} profile The profile.
   * @param {Object} level The level.
   */
  constructor(profile, level) {
    this.profile = profile;
    this.level = level;
  }

  /**
   * Generates the profile files (README and, if first level, player code).
   */
  generate() {
    this.generateReadmeFile();
    if (this.profile.levelNumber === 1) {
      this.generatePlayerCodeFile();
    }
  }

  /**
   * Generates the README file (README.md).
   */
  generateReadmeFile() {
    const template = fs.readFileSync(README_TEMPLATE_FILE_PATH, 'utf8');
    const data = {
      getFloorMap,
      getFloorMapKey,
      profile: this.profile,
      level: this.level,
    };
    const options = { filename: README_TEMPLATE_FILE_PATH };
    const renderedReadme = ejs.render(template, data, options);
    fs.writeFileSync(this.profile.getReadmeFilePath(), renderedReadme);
  }

  /**
   * Generates the player code file (e.g., Player.js, Player.py, Player.cs).
   */
  generatePlayerCodeFile() {
    const templateFilePath = getPlayerCodeTemplateFilePath(
      this.profile.languageId || 'javascript',
    );
    fs.copyFileSync(templateFilePath, this.profile.getPlayerCodeFilePath());
  }
}

export default ProfileGenerator;
