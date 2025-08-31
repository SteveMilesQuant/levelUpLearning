FROM python:3.9-slim as base

WORKDIR /lul-api

# Install dependencies first, caching the layer
COPY requirements.txt .
RUN python3 -m pip install --no-cache-dir --upgrade pip \
    && pip install --no-cache-dir -r requirements.txt

COPY . /lul-api
ARG APP_UID=1000
ARG APP_GID=1000
RUN groupadd -g $APP_GID app \
    && useradd -m -u $APP_UID -g app app \
    && python3 -m compileall /lul-api

# Actual api
FROM base as api
WORKDIR /lul-api
USER app
EXPOSE 3000
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "3000"]

# Email sender
FROM base as email
WORKDIR /lul-api
USER app
CMD ["python3", "autoemails.py"]

# Certfication checker
FROM base as cert-check
WORKDIR /lul-api
USER app
CMD ["python3", "certcheck.py"]
