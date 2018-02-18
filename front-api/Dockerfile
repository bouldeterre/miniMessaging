## DockerFile

## Env
FROM node:9.5.0

ENV USER root
ENV HOME /root
ENV DEBUG *Api*

RUN mkdir /Api

# install node packages in separate folder
ADD package.json /tmp/package.json
RUN cd /tmp && npm install
RUN cp -a /tmp/node_modules /Api


WORKDIR /Api
CMD ["node", "app.js"]

COPY . /Api/.
