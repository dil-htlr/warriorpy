# Multi-Language Architecture Diagram

## System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         WarriorJS Game                          │
│                                                                 │
│  ┌───────────┐      ┌──────────┐      ┌─────────────────┐     │
│  │  Profile  │─────▶│   Game   │─────▶│ ProfileGenerator│     │
│  │           │      │          │      │                 │     │
│  │ warriorName│     │ playLevel()│    │ generate()       │     │
│  │ tower      │     │ loadProfile()│  │                 │     │
│  │ languageId │     └─────┬────┘      └────────┬────────┘     │
│  └───────────┘            │                    │              │
│                           │                    │              │
└───────────────────────────┼────────────────────┼──────────────┘
                           │                    │
                           ▼                    ▼
          ┌────────────────────────┐   ┌───────────────┐
          │    @warriorjs/core     │   │  Templates    │
          │                        │   │               │
          │  ┌─────────────────┐  │   │ Player.js     │
          │  │  runLevel()     │  │   │ Player.py     │
          │  │  loadLevel()    │  │   │ Player.cs     │
          │  │  loadPlayer()   │  │   └───────────────┘
          │  └────────┬────────┘  │
          │           │           │
          │           ▼           │
          │  ┌─────────────────┐  │
          │  │LanguageRegistry │  │
          │  │                 │  │
          │  │ get(languageId) │  │
          │  │ getAll()        │  │
          │  │ getDefault()    │  │
          │  └────────┬────────┘  │
          │           │           │
          └───────────┼───────────┘
                     │
        ┌────────────┼────────────┐
        │            │            │
        ▼            ▼            ▼
┌──────────────┐ ┌──────────┐ ┌────────────┐
│  JavaScript  │ │  Python  │ │    C#      │
│   Adapter    │ │  Adapter │ │  Adapter   │
│              │ │          │ │            │
│ ✅ Fully     │ │ 🚧 Arch  │ │ 🚧 Arch    │
│ Implemented  │ │ Ready    │ │ Ready      │
└──────────────┘ └──────────┘ └────────────┘
```

## Language Adapter Pattern

```
┌──────────────────────────────────────────────────────┐
│            LanguageAdapter (Base Class)              │
│                                                      │
│  + getId(): string                                   │
│  + getName(): string                                 │
│  + getFileExtension(): string                        │
│  + getTemplateFilename(): string                     │
│  + loadPlayer(code: string): Function                │
│  + toString(): string                                │
└───────────┬──────────────────────────────────────────┘
            │ extends
            │
    ┌───────┴──────┬──────────────┬────────────┐
    │              │              │            │
    ▼              ▼              ▼            ▼
┌─────────┐  ┌──────────┐  ┌──────────┐  ┌─────────┐
│JavaScript│  │  Python  │  │   C#     │  │ Future  │
│ Adapter  │  │ Adapter  │  │ Adapter  │  │Languages│
│          │  │          │  │          │  │         │
│getId()   │  │getId()   │  │getId()   │  │ • Ruby  │
│ ='js'    │  │ ='python'│  │='csharp' │  │ • Go    │
│          │  │          │  │          │  │ • Java  │
│load      │  │load      │  │load      │  │ • Rust  │
│Player()  │  │Player()  │  │Player()  │  │ • ...   │
│  ✅      │  │  🚧      │  │  🚧      │  └─────────┘
└─────────┘  └──────────┘  └──────────┘
```

## Data Flow

### Profile Creation
```
User Input
    │
    ├─ Warrior Name
    ├─ Tower Selection
    └─ Language Selection ← NEW!
         │
         ▼
    ┌────────┐
    │Profile │
    │        │
    │languageId: 'javascript' | 'python' | 'csharp'
    └────┬───┘
         │
         ▼
    Generate Template
         │
         ├─ Player.js  (JavaScript)
         ├─ Player.py  (Python)
         └─ Player.cs  (C#)
```

### Code Execution Flow
```
Player writes code in chosen language
         │
         ▼
    ┌─────────┐
    │Profile  │
    │reads    │
    │Player.* │
    └────┬────┘
         │
         ▼
    ┌──────────────┐
    │ loadPlayer() │
    └──────┬───────┘
           │
           ▼
    ┌──────────────────┐
    │LanguageRegistry  │
    │ get(languageId)  │
    └──────┬───────────┘
           │
           ▼
    ┌─────────────────┐
    │Language Adapter │
    │ loadPlayer()    │
    └──────┬──────────┘
           │
           ├─ JavaScript: vm.runInContext()
           │     ✅ Fully working
           │
           ├─ Python: spawn python3 process
           │     🚧 To be implemented
           │
           └─ C#: dotnet build & run
                 🚧 To be implemented
```

## Component Responsibilities

### Core Components

**LanguageAdapter (Base)**
- Defines interface for all language implementations
- Abstract methods must be overridden
- Provides toString() for display

**JavaScriptAdapter**
- Uses Node.js VM module
- Sandboxed execution
- Validates Player class and playTurn method
- Error handling with clear messages

**PythonAdapter**
- Structure in place
- Throws helpful "not implemented" error
- Template file ready
- Awaiting IPC bridge implementation

**CSharpAdapter**
- Structure in place  
- Throws helpful "not implemented" error
- Template file ready
- Awaiting compilation and IPC bridge

**LanguageRegistry**
- Singleton pattern
- Auto-registers default adapters
- Provides access to all languages
- Returns default (JavaScript)

### Integration Points

**Profile System**
- Stores languageId
- Gets correct file path
- Serializes/deserializes language preference

**Game Flow**
- Prompts for language selection
- Passes languageId through execution chain

**Execution Chain**
- runLevel → loadLevel → loadWarrior → loadPlayer
- Each level passes languageId parameter
- Default to 'javascript' for backward compatibility

## Extension Example: Adding Ruby

```javascript
// 1. Create RubyAdapter.js
class RubyAdapter extends LanguageAdapter {
  getId() { return 'ruby'; }
  getName() { return 'Ruby'; }
  getFileExtension() { return '.rb'; }
  getTemplateFilename() { return 'Player.rb'; }
  
  loadPlayer(playerCode) {
    // Implement Ruby execution via child_process
    // Serialize warrior state to JSON
    // Deserialize actions from Ruby
    // Return playTurn function
  }
}

// 2. Create Player.rb template
class Player
  def play_turn(warrior)
    # Cool code goes here.
  end
end

// 3. Register in LanguageRegistry
registerDefaultAdapters() {
  this.register(new JavaScriptAdapter());
  this.register(new PythonAdapter());
  this.register(new CSharpAdapter());
  this.register(new RubyAdapter()); // ← Add here
}

// 4. Export in index.js
export { default as RubyAdapter } from './RubyAdapter';
```

That's it! The system handles the rest automatically.

## Benefits of This Architecture

✅ **Separation of Concerns**: Language logic isolated in adapters
✅ **Open/Closed Principle**: Open for extension, closed for modification
✅ **Single Responsibility**: Each adapter handles one language
✅ **Dependency Inversion**: Game depends on abstractions, not implementations
✅ **Interface Segregation**: Clean, minimal interface for adapters
✅ **Extensibility**: Adding languages is straightforward
✅ **Testability**: Each component can be tested independently
✅ **Maintainability**: Changes to one language don't affect others

## Future Enhancements

1. **Plugin System**: Load language adapters from npm packages
2. **Language Detection**: Auto-detect from file extension
3. **Language-Specific READMEs**: Generate instructions per language
4. **Type Definitions**: Provide .d.ts, .pyi, etc. for each language
5. **Hot Reload**: Watch player file and reload on changes
6. **Multi-Language Profiles**: Switch languages mid-game
7. **Community Adapters**: Package manager for language adapters
8. **Performance Monitoring**: Track execution time per language
