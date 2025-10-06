FROM gcr.io/distroless/nodejs22-debian12@sha256:4457cf5f47fa4bc2d3a3733feb08180bdbd5fd0ee176da532984ab2444b76fcc


WORKDIR /app
COPY .next/standalone ./
COPY .next/static ./.next/static

ENV NODE_ENV=production

EXPOSE 3000

ENV PORT=3000

CMD ["server.js"]
