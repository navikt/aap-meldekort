FROM gcr.io/distroless/nodejs22-debian12@sha256:b0df7917d86c254e76d0855775679d9ee4ec7c307503259d92f431b618393a4d


WORKDIR /app
COPY .next/standalone ./
COPY .next/static ./.next/static

ENV NODE_ENV=production

EXPOSE 3000

ENV PORT=3000

CMD ["server.js"]
