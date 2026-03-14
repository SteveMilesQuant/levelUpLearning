# System Architecture

Front and back end for leveluplearning.com — booking of summer and year-round educational camps.

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
    hooks/                React Query hooks + form hooks (Zod schema)
    components/           UI components
    utils/                (optional)

app/src/services/       Generic APIClient<S,Q> and APIHooks<S,Q>
app/src/pages/          Route-level page components
app/src/components/     Shared components (nav, buttons, modals)
app/src/theme.ts        Chakra theme with brand colors
```

## Key Patterns

### Back End

- **ORM models** (`api/db.py`): Named `<Entity>Db`. Use `Mapped`/`mapped_column`. Each has a `.dict()` method. Many-to-many via junction tables (`user_x_students`, etc.).
- **Pydantic models** (`api/datamodels.py`): `<Entity>Data` (editable fields) → `<Entity>Response(Data)` adds `id`. These correspond 1:1 with front end TypeScript interfaces.
- **Entity classes** (`api/<module>.py`): Extend Response, hold `_db_obj: PrivateAttr`. Methods: `create(session)` (fetch or insert), `update(session)`, `delete(session)`.
- **Endpoints** (`api/main.py`): Grouped by `# SECTION` comments. Auth via `get_authorized_user(request, session)`. Role checks: `user.has_role('ADMIN')`.
- **Migrations**: Plain SQL in `api/migration/YYYY-MM-DD.sql`.

### Front End

- **APIClient<S, Q>** (`app/src/services/api-client.ts`): Generic HTTP client wrapping axios. Methods: `getAll`, `get`, `post`, `put`, `delete`.
- **APIHooks<S, Q>** (`app/src/services/api-hooks.ts`): Wraps APIClient with React Query. Exports: `useData`, `useDataList`, `useAdd`, `useUpdate`, `useDelete`. Instantiated per module.
- **Form hooks**: Use `useForm` + `zodResolver` for validation. Export `register`, `errors`, `control`, `handleSubmit`, `handleClose`.
- **Brand colors** (`theme.ts`): Always use `brand.*` tokens — never raw Chakra color scales. Available: `primary`, `secondary`, `tertiary`, `text`, `buttonBg`, `green`, `warning`, `hover`, `selected`, `disabled`, `lightGray`. Add new colors to theme.ts if needed.
- **Navigation**: Desktop in `NavBarDesktop.tsx` (role-based dropdown). Mobile in `SideIconList.tsx` (icon + drawer, role-gated items).

## Workflow for Adding a Feature

1. **Database**: Update `api/db.py` with new/modified model. Create migration SQL.
2. **Pydantic models**: Update `api/datamodels.py` (Data + Response classes).
3. **Entity class**: Create or update `api/<module>.py`.
4. **Endpoints**: Add to `api/main.py` under appropriate section.
5. **Tests**: Add to `api/tests/test_<module>.py`. Use `TestClient`, parametrize, and assert status codes + JSON.
6. **Front end types**: Update `app/src/<module>/<Module>.ts` to mirror `datamodels.py`.
7. **Service + hooks**: Create/update `hooks/use<Module>s.ts` (React Query) and `hooks/use<Module>Form.ts` (Zod + react-hook-form).
8. **Components**: Create/update form body and entry components.
9. **Navigation**: If adding a new page, add to both `SideIconList.tsx` and `NavBarDesktop.tsx`.
10. **Run tests**: `pytest` from `api/` directory.
    