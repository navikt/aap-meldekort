FROM gcr.io/distroless/nodejs22-debian12@sha256:b021c77c7054088ca6047779508b834ee9bd812e22d0276190d4224e26352abf


WORKDIR /app
COPY .next/standalone ./
COPY .next/static ./.next/static

ENV NODE_ENV=production

EXPOSE 3000

ENV PORT=3000

CMD ["server.js"]
