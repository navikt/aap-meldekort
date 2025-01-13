FROM gcr.io/distroless/nodejs22-debian12@sha256:d00edbf864c5b989f1b69951a13c5c902bf369cca572de59b5ec972552848e33


WORKDIR /app
COPY .next/standalone ./
COPY .next/static ./.next/static

ENV NODE_ENV=production

EXPOSE 3000

ENV PORT=3000

CMD ["server.js"]
