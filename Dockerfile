FROM gcr.io/distroless/nodejs22-debian12@sha256:ee4a35606ca4f0d4d9d376cb18a3e330dd84ebebf30215cd29e867b2bcd12132


WORKDIR /app
COPY .next/standalone ./
COPY .next/static ./.next/static

ENV NODE_ENV=production

EXPOSE 3000

ENV PORT=3000

CMD ["server.js"]
