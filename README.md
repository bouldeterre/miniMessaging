# 🚀Get some services connected!

This Project is composed of 3 services, communicating with Kafka:

##### 1️⃣ The front API

A simple API (nodeJS) exposing only one endpoint: **POST api/message** on **port 4242**.
The message (body of the http request) is sent to kafka on a topic T.

* Stack: nodeJS, express, kafka-node,

##### 2️⃣ Kafka - the message broker

Kafka process the message and send it to the consumers (3️⃣ and 4️⃣)

* Stack: Docker/Docker-Compose, kafka, zookeeper

##### 3️⃣ The slack service

The service consumes messages of topic T from Kafka. Using Slack's API it sends any incoming message to [#random](https://join.slack.com/t/kafkamessagingpe/shared_invite/enQtMzE2MDE0NTUwMjQwLTcyNTYxYzRmNTAyOWVmNmI2NTcyZTE5ZDI1NTljNTY1YTQzYWZmYWJjNWRiMTE2YTNkZDNkZjQzN2M5YWVmNzM) on kafkamessagingpe Team.

Invite here:
https://join.slack.com/t/kafkamessagingpe/shared_invite/enQtMzE2MDE0NTUwMjQwLTcyNTYxYzRmNTAyOWVmNmI2NTcyZTE5ZDI1NTljNTY1YTQzYWZmYWJjNWRiMTE2YTNkZDNkZjQzN2M5YWVmNzM

* Stack: nodeJS, kafka-node, slack-node

##### 4️⃣ The email service

The service also consumes messages of topic T from Kafka It sends an email for any incoming message. To avoid spaming with a true address, we use maildev as a local email service to see the previews.

MailDev adress: http://localhost:1080/#/

* Stack: nodeJS, kafka-node, mailDev, nodemailer, bluebird

## 🗃️Pre-Requisites

* docker-compose : install docker-compose https://docs.docker.com/compose/install/
* Slack Channel:
  https://join.slack.com/t/kafkamessagingpe/shared_invite/enQtMzE2MDE0NTUwMjQwLTcyNTYxYzRmNTAyOWVmNmI2NTcyZTE5ZDI1NTljNTY1YTQzYWZmYWJjNWRiMTE2YTNkZDNkZjQzN2M5YWVmNzM
* curl or Postman: https://www.getpostman.com/

## 🛠️ Usage

Start the project

```bash
docker-compose up -d
```

ex: Start with 3 kafka Instances

```bash
docker-compose up -d --scale kafka=3
```

Send a message to the front API

```bash
 curl -X POST -H "Content-Type: text/plain" --data 'This is a message' 127.0.0.1:4242/api/message
```

The message will be posted on Slack #random and MailDev http://localhost:1080/#/

## 📝Logging

To enable/desable logs, remove or specify the DEBUG env variable of docker-compose.yml for each container

```
#Full logs
environment:
  DEBUG=*
```

```
#Api logs
environment:
  - DEBUG=*Api*
```

```
Sat, 17 Feb 2018 16:53:27 GMT Api:modules:router Initialize router
Sat, 17 Feb 2018 16:53:27 GMT Api:modules:router Load router
Sat, 17 Feb 2018 16:53:27 GMT Api:modules:configurer Initialize configurer
Sat, 17 Feb 2018 16:53:27 GMT Api:config:logger Use Morgan to log requests with level: dev
Sat, 17 Feb 2018 16:53:29 GMT Api:config:kafka Loading kafka...
Sat, 17 Feb 2018 16:53:29 GMT Api:modules:router Use configurer
Sat, 17 Feb 2018 16:53:29 GMT Api:config:routes Initialize project with routes
 { 'POST /api/message': { loadFile: 'routes/api/message' } }
Sat, 17 Feb 2018 16:53:29 GMT Api:modules:router Router listen to port 4343
Sat, 17 Feb 2018 16:53:30 GMT Api:config:kafka Kafka producer ready
```

## ⚠️ Integration tests

Local:

```bash
docker-compose up
cd front-api
npm install
npm run test
```

With docker-compose:

```bash
docker-compose -f docker-compose.test.yml up -d
```

## 🔮 Next Steps

* Accept form-data message to send files using Local or BucketStorage.
* Add other platforms, Discord/Telegram
* Log errors in a Monitoring DashBoard

=]
