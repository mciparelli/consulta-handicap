# base node image
FROM node:18.13.0-bullseye-slim as base

# set for base and all layer that inherit from it
ENV NODE_ENV production
ENV DATABASE_LOCATION file:/data/db.sqlite3
ENV PORT 8080

# Install openssl for Prisma
RUN apt-get update && apt-get install -y openssl sqlite3

WORKDIR /app

ADD . ./
RUN yarn --production=false

RUN yarn build

CMD yarn start