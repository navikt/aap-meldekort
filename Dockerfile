FROM gcr.io/distroless/nodejs22-debian12@sha256:3732180ba4a39101bd95b7105ef0c47526c197d6c29c6d48f7059a647a4064a5


WORKDIR /app
COPY .next/standalone ./
COPY .next/static ./.next/static

ENV NODE_ENV=production

EXPOSE 3000

ENV PORT=3000

CMD ["server.js"]
