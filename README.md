# Dave's Secrets Server

This project is intended to be a secrets server. This is built with Node.js using Express routes with JWT authentication and Express sessions.

## Install

To install the backend on a server, make sure you have these prerequisite programs installed onto your server.

- Node.js 14 and above
- npm
- MongoDB 5.0 and above
- Git

Lookup any guides out there to install this software relating to your OS and development environment.

### Download Project

You can download this project by using the git clone command. Make sure you have proper authorization to use to this Git repository as it may ask for a username and password (or token).

`git clone https://github.com/dmorales22/daves-secrets-server`

### Quick Start

Once the project is downloaded. Go to the directory of the project in your command line and run this command to install dependencies:

`npm install`

Then start up the server with this command:

`npm start`

If there are any errors, make sure you have the prerequisite software and any dependencies installed first.

### systemd service

If you want this server to run continuously in the background, you can create systemd service (Linux distros that use systemd only).

Let's first create the service by running this command:

`sudo nano /etc/systemd/system/daves-secrets-server.service`

Then copy and paste this text below (change `WorkingDirectory` to where ever you downloaded the project):

```
[Unit]
Description=RenRate backend for iM
After=network.target

[Service]
Type=simple
User=root
WorkingDirectory=/home/ubuntu/daves-secrets-server
ExecStart=node server.js
StartLimitIntervalSec=30
StartLimitBurst=2
Restart=on-failure

[Install]
WantedBy=multi-user.target
```

Then save and close the file.

You can start the server by running this command:

`sudo systemctl start daves-secrets-server`

And to make sure the server starts at startup:

`sudo systemctl enable daves-secrets-server`

You can view the status of the server using this command:

`sudo systemctl status daves-secrets-server`

## Environment Variables

To run this project, you will need to add the following environment variables to your .env file

`PORT` The port the server will run on. Any ports below 1024 will require root access. Please input only a number here.

Ex: 5001

`MONGODB_USER` The user of the MongoDB

Ex: dev

`MONGODB_NAME` The name of the database you are trying to access to.

Ex: DevDB

`MONGODB_SERVER` The URL or IP address of the database server

Ex: localhost:27012

`DB_PASSWORD` The password of the user to access the database server

Ex: devPass233xLc@

`TOKEN_KEY` The key for the JWT tokens. It can be any sequence of numbers and letters, just make sure it's a strong key.

Ex: bn2sLcM34xX302PIn\*23

### Sample .env

And of course, there's a sample .env file is included in this repo.

## Contributors

Here are the list of people have contributed to this repo:

- David Morales (dmoral1414@gmail.com)

## Documentation
- Code: In the `docs` folder
