FROM gcr.io/distroless/nodejs22-debian12@sha256:3c90d20cfa08093504ee4795fae9e2571b605dd975b3992e1ef8ccf8b146388a


WORKDIR /app
COPY .next/standalone ./
COPY .next/static ./.next/static

ENV NODE_ENV=production

EXPOSE 3000

ENV PORT=3000

CMD ["server.js"]
