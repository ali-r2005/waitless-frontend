---
trigger: always_on
---

All features must respect this folder structure:

src/
 ├─ app/
 ├─ components/
 ├─ hooks/
 ├─ services/
 ├─ store/
 ├─ types/
 └─ lib/


Any new global state → add a Zustand store in src/store/

Any new reusable UI → use ShadCN component or extend from /components/ui

All pages → placed under /app and grouped logically (e.g. /app/(feature-name)/xxxx/page.tsx)

🎨 2. UI Rules

Use only ShadCN components for:

Buttons

Inputs

Modals

Alerts

Cards....ext

Colors: stick with the colors defined in the globals.css

Spacing: use Tailwind padding/margin in multiples of 4 (p-4, p-8, etc.)

Typography: prefer ShadCN’s typography utilities or Tailwind classes (text-xl, font-semibold).

use Tailwind or ShadCN variants.

⚙️ 3. Logic Rules

Use React Query for all server data fetching and caching.
use React Hook Form + Zod for form handeling

Use Axios instance from src/services/api/axios.ts for all requests.

Use Zustand for local or global UI state (not React context).

Avoid direct fetch() calls — always use axios.

📦 4. Component Creation Rules

When creating a new feature (e.g., “Add a search bar”):

Place new UI inside src/components/shared or appropriate route.

If reusable, move it to src/components/ui.

If feature requires data fetching:

Use ShadCN components in the UI.

🔧 5. Code Style

Use TypeScript everywhere

Use ESLint + Prettier

Avoid any unused imports or variables

Use alias imports (@/components, @/hooks, etc.)

🧭 6. UX Consistency

Keep layouts clean and minimal (like Fiverr)

Keep all buttons and links meaningful (“Create queue”, not “Click here”)