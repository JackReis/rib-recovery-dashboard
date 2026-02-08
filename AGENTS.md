1→# Agent Development Guide
2→
3→## Setup
4→```bash
5→npm install                    # Install dependencies
6→npm start                      # Run dev server at http://localhost:3000
7→```
8→
9→## Commands
10→- **Build**: `npm run build` (outputs to `/build`)
11→- **Test**: `npm test` (Jest via react-scripts)
12→- **Lint**: Uses ESLint via `react-app` config (runs during build)
13→- **Dev Server**: `npm start`
14→
15→## Tech Stack
16→- **React 18** with functional components and hooks
17→- **Tailwind CSS** for styling (config: `tailwind.config.js`)
18→- **Lucide React** for icons
19→- **React Scripts 5.0** (Create React App toolchain)
20→
21→## Architecture
22→- `src/App.js`: Main app shell with view switching
23→- `src/RecoveryDashboard.js`: Rib recovery tracking interface
24→- `src/HealthcareDashboard.js`: Healthcare provider management
25→- `src/components/`: Reusable UI components
26→- `src/data/`: Data files for protocols and providers
27→
28→## Code Style
29→- Use functional components with hooks (useState, useEffect)
30→- Tailwind utility classes for styling (no custom CSS unless necessary)
31→- Lucide React for all icons
32→- 2-space indentation, single quotes for strings
33→