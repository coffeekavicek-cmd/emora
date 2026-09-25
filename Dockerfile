FROM node:22-alpine
WORKDIR /app
COPY v4-release/chunks/ /tmp/emora-v4/
RUN cat /tmp/emora-v4/part-* | base64 -d > /tmp/emora-v4.br \
 && node -e "const fs=require('fs'),z=require('zlib');fs.writeFileSync('/tmp/emora-v4.tar',z.brotliDecompressSync(fs.readFileSync('/tmp/emora-v4.br')))" \
 && tar -xf /tmp/emora-v4.tar -C /app \
 && rm -rf /tmp/emora-v4 /tmp/emora-v4.br /tmp/emora-v4.tar
ENV NODE_ENV=production
EXPOSE 3000
CMD ["node", "server.mjs"]
