FROM gcr.io/distroless/nodejs22-debian12@sha256:b2811d7945a1f3ef91cf8a2ead779171b438eb0011f3bdee0c8cc60cb90b2c0c


WORKDIR /app
COPY .next/standalone ./
COPY .next/static ./.next/static

ENV NODE_ENV=production

EXPOSE 3000

ENV PORT=3000

CMD ["server.js"]
