FROM gcr.io/distroless/nodejs22-debian12@sha256:6d3a88ffd7d07ae86d1ee973b8f889c4e5f8f1235bac2b1099435385c04a8bef


WORKDIR /app
COPY .next/standalone ./
COPY .next/static ./.next/static

ENV NODE_ENV=production

EXPOSE 3000

ENV PORT=3000

CMD ["server.js"]
