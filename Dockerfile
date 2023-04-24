# base node image
FROM node:current as base

# Install openssl and sqlite3 for Prisma
RUN apt-get update && apt-get install -y openssl sqlite3

WORKDIR /app

ADD . ./
RUN npm install

RUN npm run build

# set for base and all layer that inherit from it
ENV NODE_ENV production
ENV DATABASE_LOCATION file:/data/db.sqlite3
ENV PORT 8080

CMD npm run start

FROM varnish:6.4
COPY default.vcl /etc/varnish/
CMD ["/usr/sbin/varnishd", "-F", "-f", "/etc/varnish/default.vcl", "-T", "none"]