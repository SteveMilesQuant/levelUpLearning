# Coding Conventions

## Back End (Python)

- SQLAlchemy models are suffixed `Db` (e.g., `StudentFormDb`).
- Pydantic models: `<Entity>Data` for input, `<Entity>Response(<Entity>Data)` for output. Response adds `id`.
- Entity classes extend the Response model and hold `_db_obj` as a Pydantic `PrivateAttr`.
- Endpoints use `async with app.db_sessionmaker() as session` for DB access.
- Permission checks: call `get_authorized_user(request, session)`, then `user.has_role('ADMIN')` or compare `user.students(session)` IDs.
- When querying models that use joined eager loading, call `.unique()` before `.scalar_one_or_none()`.
- DateTime fields stored in DB as `DateTime`, serialized to ISO 8601 strings in Pydantic responses.

## Database Migrations

Migration scripts are plain SQL files in `api/migration/YYYY-MM-DD.sql`. Whether one is needed will be specified by the user — do not create a migration script unless explicitly asked.

## Front End (TypeScript / React)

- TypeScript interfaces must mirror `api/datamodels.py` exactly. `Data` ↔ `StudentFormData`, `Response` ↔ `StudentFormResponse`.
- Use brand colors from `theme.ts` — never use raw Chakra color scales (e.g., `orange.200`). If a new color is needed, add it to the `brand` object in `theme.ts`.
- Chakra `Tooltip` (used by `InputError`) requires a single DOM element child. Wrap compound children (like `Controller` + `RadioGroup`) in a `Box`.
- Form validation: use Zod schemas resolved via `zodResolver`. Expose `trigger()` from `useForm` for manual validation before closing modals.
- Paged modals: define `FIELD_TO_PAGE` mapping so validation errors navigate to the correct page.
- Cache keys: define as exported constants (e.g., `CACHE_KEY_FORMS = ["forms"]`).
- Barrel exports from `index.ts` in each module.
- **Phone formatting**: use `formatPhone()` from `app/src/utils/phone.ts` to format phone number inputs to `(XXX) XXX - XXXX`. Apply it in `onChange` via `Controller`, and when pre-populating `defaultValues` from existing data.
- **Dynamic field lists**: use `useFieldArray` from `react-hook-form`. Add rows with `ActionButton` + `FaPlus` (from `react-icons/fa`). Remove rows with `DeleteButton`. For the first row, use a `Tooltip` wrapping `AiOutlineQuestionCircle` (from `react-icons/ai`) to explain field behavior inline.
- **Info icon**: `AiOutlineQuestionCircle` from `react-icons/ai` wrapped in a Chakra `Tooltip` and a `Box as="span"` for inline icon help text.
