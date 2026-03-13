# System Architecture

Front and back end for the website leveluplearning.com to allow for booking of summer camps.

## Repository structure

api/
    Back end FastAPI (Python) code with sqlalchemy

api/tests/
    Pytest tests

api/migration/
    Migration SQL scripts

app/src/
    Front end in React and Chakra UI

Front end module pattern:

app/src/module/
    components/
    hooks/
    utils/
    Module.ts
    index.ts

## Typical workflow for adding a feature

1. Identify what needs updating: database, back end, and/or front end
2. Database updates
    1. Update api/db.py
    2. Create migration script named YEAR-MO-DY.sql with MySql migration code
3. Back end updates
    1. Update api/datamodels.py for return values from endpoints
    2. Identify module updated
    3. Update class or functions in module.py
    4. Identify endpoints updated
    5. Update endpoint in api/main.py
    6. Update tests
4. Front end updates
    1. Identify the module updated
    2. Update the interface in /app/src/module/Module.ts to reflect the changes you made to api/datamodels.py. These should always correspond.
    3. Update /app/module/hooks/useModuleForm.ts
    4. Update /app/module/components/ModuleFormBody.tsx
    