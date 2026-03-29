---
applyTo: "api/**"
description: "Use when modifying Python backend code — FastAPI endpoints, SQLAlchemy ORM models, Pydantic schemas, or entity classes."
---
# Back End Conventions

## ORM Models (`api/db.py`)

- Named `<Entity>Db` (e.g., `StudentFormDb`).
- Use `Mapped`/`mapped_column`. Each has a `.dict()` method.
- Many-to-many via junction tables (`user_x_students`, etc.).
- When querying models that use joined eager loading, call `.unique()` before `.scalar_one_or_none()`.

## Pydantic Models (`api/datamodels.py`)

- `<Entity>Data` for input, `<Entity>Response(<Entity>Data)` for output. Response adds `id`.
- These correspond 1:1 with front end TypeScript interfaces.

## Entity Classes (`api/<module>.py`)

- Extend the Response model and hold `_db_obj` as a Pydantic `PrivateAttr`.
- Methods: `create(session)` (fetch or insert), `update(session)`, `delete(session)`.

## Endpoints (`api/main.py`)

- Grouped by `# SECTION` comments.
- Auth via `get_authorized_user(request, session)`.
- Role checks: `user.has_role('ADMIN')`.
- DB access: `async with app.db_sessionmaker() as session`.
- Authorization for camp-scoped actions: `camp.user_authorized(session, user)` (allows admin + camp instructors).
- DateTime fields stored as `DateTime` in DB, serialized to ISO 8601 strings in Pydantic responses.
