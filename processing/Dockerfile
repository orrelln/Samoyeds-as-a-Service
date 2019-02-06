FROM python:3.6

RUN mkdir -p /processing
WORKDIR /processing

RUN pip install keras numpy tensorflow Pillow pika image-classifiers

COPY . /processing

CMD ["python", "./main.py"]

