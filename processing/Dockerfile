FROM python:3.6

COPY requirements.txt /
RUN pip3 install -r /requirements.txt

RUN mkdir -p /processing
WORKDIR /processing

COPY . /processing

ADD https://github.com/ufoscout/docker-compose-wait/releases/download/2.5.0/wait /wait
RUN chmod +x /wait

CMD /wait && python /processing/main.py
