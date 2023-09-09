# Create a docker file for python 3.10 from an alpine image
# Use pip to install flask
# Use pip to install tiktoken
# Copy the /usr/tiktoken/tiktoken_server.py file to the container
# The entry point for the container is python -m flask --app /usr/tiktoken/tiktoken_server.py run

FROM python:3

RUN pip install --upgrade pip
RUN pip install flask
RUN pip install -U transliterate
RUN pip install transformers
RUN pip install torch
RUN pip install pandas
RUN pip install numpy
RUN pip install scikit-learn
COPY src/server.py /usr/server/server.py
COPY src/pipeline.py /usr/server/pipeline.py
COPY src/data.csv /usr/server/data.csv

CMD ["python", "-m", "flask", "--app", "/usr/server/server.py", "run", "--host", "0.0.0.0"]