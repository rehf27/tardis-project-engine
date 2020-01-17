#FROM node:dubnium-alpine as BASE
FROM node:10-alpine as BASE

FROM BASE as BUILD
# Provides cached layer for node_modules
#COPY package.json yarn.lock /tmp/
#RUN cd /tmp && yarn install
#RUN yarn build
# RUN mkdir -p /build && cp -a /tmp/node_modules /app/

FROM BASE as RELEASE
RUN mkdir -p /app
# if slim -> RUN groupadd -r bpgroup && useradd --no-log-init -r -d /app -g bpgroup bpuser
# if alpine ->
RUN addgroup -S tardis && adduser -S -h /app -G tardis tardis
RUN chown -R tardis:tardis /app

WORKDIR /app
COPY . /app
COPY --chown=tardis:tardis --from=BUILD /staging/app /app

RUN npm install

# Define the /ping url as the healthcheck
HEALTHCHECK CMD ./healthcheck.sh || exit 1

# Start 'er up
CMD ["yarn", "start"]

