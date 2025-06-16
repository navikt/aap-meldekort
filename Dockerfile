FROM gcr.io/distroless/nodejs22-debian12@sha256:3bbb76acb752a4ed1275fd337d005e37cd35706a4f97f916ee1d65a30b486915


WORKDIR /app
COPY .next/standalone ./
COPY .next/static ./.next/static

ENV NODE_ENV=production

EXPOSE 3000

ENV PORT=3000

CMD ["server.js"]
