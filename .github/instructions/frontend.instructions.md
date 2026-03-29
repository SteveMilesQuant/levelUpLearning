---
applyTo: "app/**"
description: "Use when modifying React/TypeScript frontend code — components, hooks, pages, routing, or styling."
---
# Front End Conventions

## Data Layer

- **APIClient<S, Q>** (`app/src/services/api-client.ts`): Generic HTTP client wrapping axios. Methods: `getAll`, `get`, `post`, `put`, `delete`.
- **APIHooks<S, Q>** (`app/src/services/api-hooks.ts`): Wraps APIClient with React Query. Exports: `useData`, `useDataList`, `useAdd`, `useUpdate`, `useDelete`.
- TypeScript interfaces must mirror `api/datamodels.py` exactly.
- Cache keys: define as exported constants (e.g., `CACHE_KEY_FORMS = ["forms"]`).
- Barrel exports from `index.ts` in each module.

## Styling

- Always use `brand.*` color tokens from `theme.ts` — never raw Chakra color scales (e.g., `orange.200`). If a new color is needed, add it to the `brand` object in `theme.ts`.
- Available brand colors: `primary`, `secondary`, `tertiary`, `text`, `buttonBg`, `green`, `warning`, `hover`, `selected`, `disabled`, `lightGray`.

## Routing

- Routes defined in `app/src/pages/routes.tsx`.
- Protected routes use `<ProtectedRoute allowedRole="ROLE">`.
- Camp context set via `<CampsContext.Provider value={CampsContextType.*}>`.

## Forms

- Use Zod schemas resolved via `zodResolver` with `useForm` from react-hook-form.
- Chakra `Tooltip` requires a single DOM element child — wrap compound children in a `Box`.
