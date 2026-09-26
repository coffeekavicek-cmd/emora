FROM node:22-alpine
WORKDIR /app
COPY v5-live/package.json ./
COPY v5-live/server.mjs ./
COPY v5-live/index.html ./
COPY v7-live/templates/ ./templates/
ENV NODE_ENV=production
EXPOSE 3000
CMD ["node","server.mjs"]
