## DockerFile

## Env
FROM node:9.5.0

ENV USER root
ENV HOME /root

RUN mkdir /Tests

# install node packages in separate folder
ADD package.json /tmp/package.json
RUN cd /tmp && npm install
RUN cp -a /tmp/node_modules /Tests


WORKDIR /Tests

COPY . /Tests/.
