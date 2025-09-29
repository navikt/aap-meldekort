FROM gcr.io/distroless/nodejs22-debian12@sha256:33a071f11d6d35fd5edc4f9ce2f41efa1e4a59b49894c545ca43456c27ab7eaa


WORKDIR /app
COPY .next/standalone ./
COPY .next/static ./.next/static

ENV NODE_ENV=production

EXPOSE 3000

ENV PORT=3000

CMD ["server.js"]
