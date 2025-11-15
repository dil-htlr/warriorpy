# Multi-Language Support in WarriorJS

## Overview

WarriorJS now supports multiple programming languages through a language adapter system. This architecture makes it easy to add support for new programming languages in the future.

## Architecture

### Language Adapters

Each programming language is supported through a `LanguageAdapter` class that implements:

- **getId()**: Returns a unique identifier (e.g., 'javascript', 'python', 'csharp')
- **getName()**: Returns the display name (e.g., 'JavaScript', 'Python', 'C#')
- **getFileExtension()**: Returns the file extension (e.g., '.js', '.py', '.cs')
- **getTemplateFilename()**: Returns the template filename (e.g., 'Player.js', 'Player.py')
- **loadPlayer(playerCode)**: Loads and executes player code, returning a playTurn function

### Language Registry

The `LanguageRegistry` manages all available language adapters. It provides:

- Registration of language adapters
- Retrieval of adapters by ID
- Listing of all available languages
- Default language (JavaScript)

### Current Support

1. **JavaScript** (Fully Implemented)
   - Native support using Node.js `vm` module
   - Player code executed in isolated sandbox
   - Template: `Player.js`

2. **Python** (Architecture Only)
   - Adapter structure in place
   - Requires implementation of Python bridge
   - Template: `Player.py`

3. **C#** (Architecture Only)
   - Adapter structure in place
   - Requires implementation of C# bridge via .NET CLI
   - Template: `Player.cs`

## Adding a New Language

To add support for a new programming language:

### 1. Create a Language Adapter

Create a new file in `/packages/warriorjs-core/src/` (e.g., `RubyAdapter.js`):

```javascript
import LanguageAdapter from './LanguageAdapter';

class RubyAdapter extends LanguageAdapter {
  getId() {
    return 'ruby';
  }

  getName() {
    return 'Ruby';
  }

  getFileExtension() {
    return '.rb';
  }

  getTemplateFilename() {
    return 'Player.rb';
  }

  loadPlayer(playerCode) {
    // Implement Ruby code execution
    // This typically involves:
    // 1. Spawning a Ruby process
    // 2. Setting up IPC (inter-process communication)
    // 3. Serializing warrior state to JSON
    // 4. Deserializing player actions from JSON
    // 5. Returning a playTurn function
  }
}

export default RubyAdapter;
```

### 2. Create a Player Template

Create a template file in `/packages/warriorjs-cli/templates/` (e.g., `Player.rb`):

```ruby
class Player
  def play_turn(warrior)
    # Cool code goes here.
  end
end
```

### 3. Register the Adapter

Add the adapter to the Language Registry in `/packages/warriorjs-core/src/LanguageRegistry.js`:

```javascript
import RubyAdapter from './RubyAdapter';

// In registerDefaultAdapters()
registerDefaultAdapters() {
  this.register(new JavaScriptAdapter());
  this.register(new PythonAdapter());
  this.register(new CSharpAdapter());
  this.register(new RubyAdapter()); // Add this line
}
```

### 4. Export the Adapter

Add the export to `/packages/warriorjs-core/src/index.js`:

```javascript
export { default as RubyAdapter } from './RubyAdapter';
```

### 5. Implement the Bridge

The most complex part is implementing the `loadPlayer()` method. This requires:

#### For Interpreted Languages (Python, Ruby, etc.)
- Spawn an interpreter process
- Create a bridge/wrapper script that:
  - Loads the player code
  - Accepts warrior state via stdin/stdout as JSON
  - Executes player's playTurn method
  - Returns actions as JSON
- Set up error handling and timeouts

#### For Compiled Languages (C#, Java, etc.)
- Compile the player code (e.g., using `dotnet build`)
- Spawn the compiled executable
- Same bridge/wrapper pattern as interpreted languages
- Handle compilation errors

### Example Bridge Pattern (Pseudocode)

```javascript
loadPlayer(playerCode) {
  // 1. Validate syntax
  // 2. Create wrapper/bridge code
  const wrapperCode = createWrapper(playerCode);
  
  // 3. Return playTurn function
  return (warrior) => {
    // 4. Start language runtime if not running
    if (!process) {
      process = spawn('language-executable', [wrapperCode]);
    }
    
    // 5. Serialize warrior state
    const warriorState = serializeWarrior(warrior);
    
    // 6. Send to language process
    process.stdin.write(JSON.stringify(warriorState));
    
    // 7. Receive actions
    const actions = JSON.parse(process.stdout.read());
    
    // 8. Execute actions on warrior
    executeActions(warrior, actions);
  };
}
```

## Warrior API Bridge

All languages must expose the same Warrior API to maintain consistency:

### Actions
- `walk(direction?)` - Move in a direction
- `attack(direction?)` - Attack in a direction
- `rest()` - Rest to restore health
- `rescue(direction?)` - Rescue a captive
- `pivot()` - Turn around
- `shoot(direction?)` - Shoot an arrow
- `bind(direction?)` - Bind an enemy
- `detonate(direction?)` - Detonate explosives

### Sensors
- `feel(direction?)` - Feel adjacent space
- `look(direction?)` - Look ahead multiple spaces
- `health()` - Current health
- `maxHealth()` - Maximum health
- `directionOfStairs()` - Direction to stairs
- `directionOf(space)` - Direction to a space
- `distanceOf(space)` - Distance to a space
- `listen()` - Listen for units
- `think(message)` - Log a thought

### Space API
- `isEmpty()` - Check if space is empty
- `isWall()` - Check if space is a wall
- `isStairs()` - Check if space is stairs
- `isEnemy()` - Check if space has enemy
- `isCaptive()` - Check if space has captive
- `isTicking()` - Check if space is ticking
- `getUnit()` - Get unit in space

## Implementation Status

### JavaScript ✅
Fully implemented and working.

### Python 🚧
Architecture in place. To complete:
1. Implement Python wrapper script
2. Set up IPC via stdin/stdout
3. Handle Python-specific errors
4. Test with actual Python code

### C# 🚧
Architecture in place. To complete:
1. Create C# wrapper project
2. Set up compilation via `dotnet build`
3. Implement IPC mechanism
4. Handle compilation and runtime errors
5. Test with actual C# code

## Testing New Languages

When adding a new language:

1. Create unit tests for the adapter
2. Test template generation
3. Test player code loading
4. Test error handling (syntax errors, runtime errors, timeouts)
5. Test all warrior API methods
6. Test with actual game levels

## Future Enhancements

Potential improvements to the language support system:

1. **Language-specific Documentation**: Generate README templates with language-specific examples
2. **Language Plugins**: Allow community-contributed language adapters as npm packages
3. **Performance Optimization**: Reuse language runtime processes across turns
4. **Better Error Messages**: Language-specific error formatting and debugging tips
5. **Type Definitions**: Provide type definitions/interfaces for supported languages
6. **Language Auto-Detection**: Detect language from file extension in existing profiles

## Contributing

If you implement support for a new language, please:

1. Follow the adapter pattern described above
2. Include comprehensive tests
3. Update this documentation
4. Provide example player code
5. Submit a pull request with your changes

## Questions?

For questions about adding language support, please open an issue on GitHub or reach out to the maintainers.
