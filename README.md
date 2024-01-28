# Car Dashboard Project
### Overview
This project is a car dashboard built using Next.js, designed to display real-time data retrieved from the OBD-II port of your car 🚗. The primary goals of this project are to gain a better understanding of real-time data handling 📊, data storage 🗄️, and management, while also providing an opportunity to practice and enhance my front-end development skills.

### Demonstration

Demonstrations, including images and videos, will be added soon

### Usage 

``` todo ```

### Contributing

#### Desktop Application

If you prefer working with desktop applications (which is the preferred method for this use case), follow these steps:

1. Install necessary dependencies:

    ```bash
    npm install
    ```

2. Next, I suggest running the Python script `test_app.py` to send fake data through Websocket to aid development. You have two options for running the script:

    - **Using Docker**: Run the following command:

        ```bash
        docker-compose up -d api
        ```

    - **Running Locally**: If you don't have Docker installed, you can run the script locally. Start by creating a virtual environment for Python and installing the required dependencies:

        ```bash
        pip install -r requirements.txt
        ```

3. Once the Python script is running using one of the methods suggested above, open a new terminal and execute the following command:

    ```bash
    npm run tauri dev
    ```

#### Web Application

If you prefer working with web applications, I highly suggest using Docker. Make sure you have Docker installed on your development device, and simply run:

```
docker compose up
```






