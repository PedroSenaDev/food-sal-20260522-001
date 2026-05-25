# FoodSal - AI Development Rules

## Tech Stack
* **Framework:** Next.js 16 (App Router) with React 19.
* **Language:** TypeScript for strict type safety across all components and hooks.
* **Styling:** Tailwind CSS 4 using utility-first classes and CSS variables for the brand theme.
* **Icons:** Lucide React for all UI iconography.
* **State Management:** React Context API via `AppContext.tsx` for global data (Cart, Menu, Settings).
* **Database:** Supabase integration with a robust LocalStorage fallback system in `src/lib/db.ts`.
* **Typography:** Next/Font with 'Playfair Display' (Serif) for headings and 'Outfit' (Sans) for body text.
* **Images:** Cloudinary for cloud uploads with Base64 fallback for local development.

## Library & Implementation Rules

### 1. UI & Styling
* **Tailwind Only:** Use Tailwind CSS for all styling. Avoid creating new `.css` files.
* **Brand Colors:** Always use the theme variables: `brand-red` (#C62828), `brand-darkred` (#8E1C1C), and `brand-beige` (#F5E6D3).
* **Responsiveness:** All components must be mobile-first and fully responsive.

### 2. State & Data
* **Global State:** Use the `useApp()` hook from `@/context/AppContext` to access or modify dishes, categories, cart, and settings.
* **Database Operations:** Never call Supabase or LocalStorage directly in components. Use the abstraction layer in `src/lib/db.ts`.
* **Mock Data:** When adding default items, update `src/lib/mockData.ts` to ensure the "Reset Database" feature remains functional.

### 3. Components & Icons
* **Icons:** Use `lucide-react` exclusively. Do not install other icon libraries.
* **Modals/Overlays:** Use the existing pattern of state-controlled overlays with Tailwind animations (`animate-in`, `fade-in`, `zoom-in`).
* **Navigation:** Use `next/link` for all internal routing to ensure SPA-like transitions.

### 4. Admin Panel
* **Auth:** Admin access is controlled via a simple password check in `AppContext`.
* **Layout:** All admin views must be wrapped in the `AdminLayout` component to maintain sidebar consistency.