FROM python:3.9
WORKDIR /level-up-learning
COPY ./requirements.txt /level-up-learning/requirements.txt
RUN python3 -m pip install --no-cache-dir --upgrade -r /level-up-learning/requirements.txt
COPY ./*.py /level-up-learning
EXPOSE 8000
CMD ["uvicorn", "main:app", "--host=0.0.0.0", "--port", "8000"]