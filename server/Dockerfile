FROM python:3.11
COPY . .
RUN pip install --user -r requirements.txt
EXPOSE 8765
#TODO: CHANGE THIS TO OBD_app.py for the real app
#TODO: removed -u when debugging is done
CMD python ./obd-reader/test_app.py & python -u ./database-client/database_client.py 
