## DockerFile

## Env
FROM node:9.5.0

ENV USER root
ENV HOME /root
ENV DEBUG *SlackService*

RUN mkdir /SlackService

# install node packages in separate folder
ADD package.json /tmp/package.json
RUN cd /tmp && npm install
RUN cp -a /tmp/node_modules /SlackService


WORKDIR /SlackService
CMD ["node", "app.js"]

COPY . /SlackService/.
