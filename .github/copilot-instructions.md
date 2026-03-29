# Project Guidelines

Booking platform for summer and year-round educational camps at leveluplearning.com.

## Tech Stack

- **Back end**: FastAPI (Python), async SQLAlchemy ORM, Pydantic models, MySQL, JWT auth
- **Front end**: React 18, TypeScript, Chakra UI, React Router v6, React Hook Form + Zod, TanStack React Query
- **Infra**: Docker Compose, Nginx, AWS EC2

## Repository Structure

```
api/                    Back end (FastAPI)
api/db.py               SQLAlchemy ORM models (suffix: Db)
api/datamodels.py       Pydantic request/response schemas (Data → Response)
api/<module>.py          Entity classes (extend Response, wrap Db model)
api/main.py             All endpoints, organized by section comments
api/tests/              Pytest tests
api/migration/          SQL scripts named YYYY-MM-DD.sql

app/src/                Front end (React + Chakra UI)
app/src/<module>/       Feature module directory
    <Module>.ts           TypeScript interfaces + cache key
    index.ts              Barrel exports
    hooks/                React Query hooks + form hooks
    components/           UI components

app/src/services/       Generic APIClient<S,Q> and APIHooks<S,Q>
app/src/pages/          Route-level page components + routes.tsx
app/src/components/     Shared components
app/src/theme.ts        Chakra theme with brand colors
```

## Workflow for Adding a Feature

1. **Database**: Update `api/db.py` with new/modified ORM model.
2. **Pydantic models**: Update `api/datamodels.py` (Data + Response classes).
3. **Entity class**: Create or update `api/<module>.py`.
4. **Endpoints**: Add to `api/main.py` under appropriate section.
5. **Tests**: Add or update `api/tests/test_<module>.py`.
6. **Front end types**: Update `app/src/<module>/<Module>.ts` to mirror `datamodels.py`.
7. **Hooks**: Create/update React Query hooks and form hooks.
8. **Components**: Create/update UI components.
9. **Route**: Add to `app/src/pages/routes.tsx` if adding a new page.
10. **Navigation**: If adding a new page, add to `SideIconList.tsx` and `NavBarDesktop.tsx`.
11. **Run tests**: `pytest` from `api/` directory.

## Migrations

Migration scripts are plain SQL in `api/migration/YYYY-MM-DD.sql`. Do not create one unless explicitly asked.
