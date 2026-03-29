---
applyTo: "api/tests/**"
description: "Use when writing or modifying pytest tests for the FastAPI backend."
---
# Testing Conventions

## Running Tests

```bash
cd api && export PYTHONPATH=. && export $(grep -v '^#' .env.dev | xargs) && source virt/bin/activate && pytest
```

Or use the VS Code task: **Pytest**.

## Test Infrastructure

- `conftest.py` creates a separate `pytest` MySQL schema, torn down after the session.
- Four test users with pre-generated JWT headers:
  - `app.test.users.admin_headers` — GUARDIAN + INSTRUCTOR + ADMIN
  - `app.test.users.instructor_headers` — GUARDIAN + INSTRUCTOR
  - `app.test.users.guardian_headers` — GUARDIAN only
  - `app.test.users.test_enroll_headers` — GUARDIAN + INSTRUCTOR + ADMIN

## Conventions

- Use `TestClient(app)` from FastAPI.
- Pass auth via `headers=app.test.users.<role>_headers`.
- Tests run in file order — use module-level dicts (e.g., `all_students_json`) to pass state between tests.
- Use `@pytest.mark.parametrize` for multiple similar inputs.
- When changing a Pydantic model field (type change, rename, add/remove), search all test files for constructions of that model and update every occurrence.
- Always test: create (201), read (200), update (200), permissions (403), not found (404), delete (200 + confirm removal).

## Gotchas

- `app.test` is a dynamic attribute set in `conftest.py` — Pylance "no member" warnings are safe to ignore.
- Module-level state dicts are populated by earlier tests. If a CREATE test fails, downstream tests will KeyError — fix the root cause first.
