FROM gcr.io/distroless/nodejs22-debian12@sha256:b25d2acae94fcf57d27f3ac29135ecdce9c0be1e8585ef52262f0dde6b36ce72


WORKDIR /app
COPY .next/standalone ./
COPY .next/static ./.next/static

ENV NODE_ENV=production

EXPOSE 3000

ENV PORT=3000

CMD ["server.js"]
