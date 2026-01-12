FROM gcr.io/distroless/nodejs22-debian12@sha256:51c3cf288add1c7b3d28c3bd1475379fd73d3a3c5a3c8ff88830dde3e49758c4


WORKDIR /app
COPY .next/standalone ./
COPY .next/static ./.next/static

ENV NODE_ENV=production

EXPOSE 3000

ENV PORT=3000

CMD ["server.js"]
