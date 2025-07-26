FROM python:3.9-alpine

WORKDIR /lul-api

# Install dependencies first, caching the layer
COPY requirements.txt .
RUN python3 -m pip install --no-cache-dir --upgrade pip \
    && pip install --no-cache-dir -r requirements.txt

# Copy only source code after dependencies
COPY ./*.py ./

RUN addgroup app && adduser -S -G app app
USER app

EXPOSE 3000
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "3000"]