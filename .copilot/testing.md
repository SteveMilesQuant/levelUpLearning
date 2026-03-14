# Testing Guide

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

## Writing Tests

- Use `TestClient(app)` from FastAPI.
- Pass auth via `headers=app.test.users.<role>_headers`.
- Tests run in file order — use module-level dicts (e.g., `all_students_json`) to pass state between tests.
- Use `@pytest.mark.parametrize` for multiple similar inputs.
- Always test:
  1. **Create** (POST) — verify 201 + response body
  2. **Read** (GET list + GET by id) — verify 200 + data matches
  3. **Update** (PUT) — verify 200 + changed fields
  4. **Permissions** — wrong user gets 403
  5. **Admin access** — admin can access cross-user resources
  6. **Delete** — non-admin gets 403, admin gets 200, subsequent GET confirms removal
  7. **Not found** — 404 for non-existent IDs

## Gotchas

- `app.test` is a dynamic attribute set in `conftest.py` — Pylance will show "no 'test' member" warnings. These are safe to ignore.
- Module-level state dicts are populated by earlier tests. If a CREATE test fails, downstream tests will KeyError. Fix the root cause first.
- Pydantic `StudentFormData` used inside `@pytest.mark.parametrize` may show as "unused import" in linters — it's a false positive.
