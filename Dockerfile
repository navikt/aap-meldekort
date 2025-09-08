FROM gcr.io/distroless/nodejs22-debian12@sha256:355fcfe4978098f7411a7574877701e9ed793042c60aaddcd10100226a891abd


WORKDIR /app
COPY .next/standalone ./
COPY .next/static ./.next/static

ENV NODE_ENV=production

EXPOSE 3000

ENV PORT=3000

CMD ["server.js"]
