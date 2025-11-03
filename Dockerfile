FROM gcr.io/distroless/nodejs22-debian12@sha256:4c4b23e6694fa5a5081f79f94ad1c272fb7ff5c4a9609edf228e5e39492543b5


WORKDIR /app
COPY .next/standalone ./
COPY .next/static ./.next/static

ENV NODE_ENV=production

EXPOSE 3000

ENV PORT=3000

CMD ["server.js"]
