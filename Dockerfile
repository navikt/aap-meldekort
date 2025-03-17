FROM gcr.io/distroless/nodejs22-debian12@sha256:176a1a417bd00cf01952c2854a3ff0b11bfb118ff91a7ab0b7307899df239d4e


WORKDIR /app
COPY .next/standalone ./
COPY .next/static ./.next/static

ENV NODE_ENV=production

EXPOSE 3000

ENV PORT=3000

CMD ["server.js"]
