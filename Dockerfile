FROM node:22-alpine
WORKDIR /app
COPY v5-live/package.json ./
COPY v5-live/server.mjs ./
COPY v5-live/index.html ./
COPY v5-live/templates/ ./templates/
COPY v5-live/tests/ ./tests/
RUN node --check server.mjs && node --check templates/cinematic.js && node --test tests/v9-smoke.test.mjs
ENV NODE_ENV=production
EXPOSE 3000
CMD ["node","server.mjs"]
