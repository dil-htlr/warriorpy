# @warriorjs/web

Browser-based WarriorJS game that runs entirely client-side. Play WarriorJS directly in your browser without any server-side processing!

## Features

- 🎮 Full game experience in the browser
- 💾 Game progress saved in localStorage
- 📝 Built-in code editor
- 🏃 Real-time game execution
- 📊 Score tracking and level progression
- 🚀 Deployable to GitHub Pages or any static hosting

## Development

### Install dependencies

```bash
yarn install
```

### Start development server

```bash
yarn start
```

This will start a development server at `http://localhost:3000`.

### Build for production

```bash
yarn build
```

The built files will be in the `dist` directory.

## Deployment

### GitHub Pages

This package is configured to be deployed via GitHub Pages. The workflow at `.github/workflows/deploy-pages.yml` automatically builds and deploys the game when pushing to the main branch.

### Manual Deployment

1. Build the project: `yarn build`
2. Upload the contents of the `dist` folder to any static hosting service

## How It Works

The web version replaces the Node.js-specific components (like the `vm` module for sandboxed code execution and `fs` for file operations) with browser-compatible alternatives:

- **Code Execution**: Uses the `Function` constructor to safely evaluate player code
- **Game State**: Uses `localStorage` to persist game progress
- **Game Logic**: All game logic (levels, abilities, units) runs in the browser

## Architecture

```
src/
├── abilities/     # Game abilities (walk, attack, feel, etc.)
├── towers/        # Tower/level definitions
├── units/         # Unit definitions (Warrior, Sludge, etc.)
├── Floor.js       # Floor class
├── Level.js       # Level class  
├── Unit.js        # Unit class
├── Warrior.js     # Warrior class
├── GameState.js   # Game state management with localStorage
├── loadPlayer.js  # Browser-safe player code loader
├── loadLevel.js   # Level loader
├── runLevel.js    # Level runner
└── index.js       # Main entry point with UI
```

## License

MIT
