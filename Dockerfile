FROM node:22-alpine
WORKDIR /app
COPY v4-live/package.json ./
COPY v4-live/server.mjs ./
COPY v4-live/index.html ./
ENV NODE_ENV=production
EXPOSE 3000
CMD ["node","server.mjs"]
