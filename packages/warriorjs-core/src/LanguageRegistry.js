import JavaScriptAdapter from './JavaScriptAdapter';
import PythonAdapter from './PythonAdapter';
import CSharpAdapter from './CSharpAdapter';

/**
 * Registry for language adapters.
 *
 * This class manages all available language adapters and provides
 * methods to retrieve them by ID or get all available languages.
 */
class LanguageRegistry {
  constructor() {
    this.adapters = new Map();
    this.registerDefaultAdapters();
  }

  /**
   * Registers the default language adapters.
   */
  registerDefaultAdapters() {
    this.register(new JavaScriptAdapter());
    this.register(new PythonAdapter());
    this.register(new CSharpAdapter());
  }

  /**
   * Registers a language adapter.
   *
   * @param {LanguageAdapter} adapter The adapter to register.
   */
  register(adapter) {
    this.adapters.set(adapter.getId(), adapter);
  }

  /**
   * Gets a language adapter by ID.
   *
   * @param {string} id The language ID.
   *
   * @returns {LanguageAdapter} The language adapter, or undefined if not found.
   */
  get(id) {
    return this.adapters.get(id);
  }

  /**
   * Gets all registered language adapters.
   *
   * @returns {LanguageAdapter[]} All registered adapters.
   */
  getAll() {
    return Array.from(this.adapters.values());
  }

  /**
   * Checks if a language adapter is registered.
   *
   * @param {string} id The language ID.
   *
   * @returns {boolean} Whether the adapter is registered.
   */
  has(id) {
    return this.adapters.has(id);
  }

  /**
   * Gets the default language adapter (JavaScript).
   *
   * @returns {LanguageAdapter} The default language adapter.
   */
  getDefault() {
    return this.get('javascript');
  }
}

// Export a singleton instance
const languageRegistry = new LanguageRegistry();

export default languageRegistry;
