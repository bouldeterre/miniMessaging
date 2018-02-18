## DockerFile

## Env
FROM node:9.5.0

ENV USER root
ENV HOME /root
ENV DEBUG *EmailService*

RUN mkdir /EmailService

# install node packages in separate folder
ADD package.json /tmp/package.json
RUN cd /tmp && npm install
RUN cp -a /tmp/node_modules /EmailService


WORKDIR /EmailService
CMD ["node", "app.js"]

COPY . /EmailService/.
