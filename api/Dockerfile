FROM python:3.11
COPY . .
RUN pip install --user -r requirements.txt
EXPOSE 8765
CMD python test_app.py # CHANGE THIS TO OBD_app.py for the real app
