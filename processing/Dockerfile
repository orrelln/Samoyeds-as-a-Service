FROM python:3.6

COPY requirements.txt /
RUN pip3 install -r /requirements.txt

RUN mkdir -p /processing
WORKDIR /processing

COPY . /processing

CMD ["python", "./main.py"]

