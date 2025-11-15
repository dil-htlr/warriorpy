import LanguageAdapter from './LanguageAdapter';

/**
 * Language adapter for C#.
 *
 * This is a placeholder implementation that demonstrates the structure.
 * A full implementation would require:
 * 1. A C# bridge/wrapper to execute player code
 * 2. Inter-process communication between Node.js and C# (e.g., via .NET CLI)
 * 3. Serialization of the warrior API state to JSON
 * 4. Deserialization of player actions from JSON
 * 5. Compilation of C# code (using dotnet build)
 */
class CSharpAdapter extends LanguageAdapter {
  /**
   * @inheritdoc
   */
  // eslint-disable-next-line class-methods-use-this
  getId() {
    return 'csharp';
  }

  /**
   * @inheritdoc
   */
  // eslint-disable-next-line class-methods-use-this
  getName() {
    return 'C#';
  }

  /**
   * @inheritdoc
   */
  // eslint-disable-next-line class-methods-use-this
  getFileExtension() {
    return '.cs';
  }

  /**
   * @inheritdoc
   */
  // eslint-disable-next-line class-methods-use-this
  getTemplateFilename() {
    return 'Player.cs';
  }

  /**
   * @inheritdoc
   */
  // eslint-disable-next-line class-methods-use-this, no-unused-vars
  loadPlayer(playerCode) {
    // TODO: Implement C# code execution
    // For now, throw a not implemented error with helpful message
    const error = new Error(
      'C# support is not yet fully implemented. This adapter provides the structure for future implementation.\n\n' +
        'To implement C# support:\n' +
        '1. Create a C# wrapper project that bridges the warrior API\n' +
        '2. Set up inter-process communication (e.g., via stdin/stdout or gRPC)\n' +
        '3. Compile C# code using dotnet CLI\n' +
        '4. Serialize warrior state to JSON and send to C# process\n' +
        '5. Deserialize actions from C# and execute on warrior object\n' +
        '6. Handle errors and timeouts appropriately',
    );
    error.code = 'NotImplemented';
    throw error;
  }
}

export default CSharpAdapter;
